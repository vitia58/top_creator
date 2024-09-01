import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import {
  CustomerAnonymisedModel,
  CustomerModel,
  TCustomer,
} from './models/customers.model';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { customAlphabet } from 'nanoid';

/**
 *
 * CLIENT PART
 *
 */

const generateCustomers = () => {
  const customers: TCustomer[] = Array.from(
    // Generates array with length 1..10
    { length: Math.floor(Math.random() * 9 + 1) },

    // Generates new customer data for each element
    () => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      address: {
        line1: faker.location.streetAddress(),
        line2: faker.location.secondaryAddress(),
        postcode: faker.location.zipCode(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        country: faker.location.countryCode(),
      },
    })
  );

  return customers;
};

const sendCustomers = async (customers: TCustomer[]) => {
  try {
    await axios.post('http://localhost:3000/', { customers });
  } catch (err) {
    console.error(err);
  }
};

setInterval(() => {
  sendCustomers(generateCustomers());
}, 200);

/**
 *
 * SERVER PART
 *
 */

const nameGenerator = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  8
);

const anonymiseCustomer = (customer: TCustomer) => {
  const newCustomer: TCustomer = {
    _id: customer._id,
    firstName: nameGenerator(),
    lastName: nameGenerator(),
    email: `${nameGenerator()}${customer.email.match(/@.*/)?.[0] ?? ''}`,
    address: {
      line1: nameGenerator(),
      line2: nameGenerator(),
      postcode: nameGenerator(),
      city: customer.address.city,
      state: customer.address.state,
      country: customer.address.country,
    },
  };

  return newCustomer;
};

config();

mongoose.connect(process.env.DB_URI!).catch((err) => {
  throw new Error(err);
});

const app = express();
app.use(bodyParser.json());

app.post('/', async (req: Request, res: Response) => {
  try {
    const customersData: TCustomer[] = req.body.customers;
    customersData.forEach((customer) => {
      customer._id = new mongoose.Types.ObjectId();
    });

    CustomerModel.insertMany(customersData, { ordered: true });

    const anonymisedCustomers = customersData.map(anonymiseCustomer);
    CustomerAnonymisedModel.insertMany(anonymisedCustomers, { ordered: true });

    res.status(201);
  } catch (error) {
    console.error('Error saving customers:', error);
    res.status(500).json({ error: 'Failed to save customers' });
  }
});
app.patch('/', async (req: Request, res: Response) => {
  try {
    const customersData: TCustomer[] = req.body.customers;

    await Promise.allSettled(
      customersData.map((customer) =>
        CustomerModel.findByIdAndUpdate(customer._id, customer)
      )
    );

    await Promise.allSettled(
      customersData.map((customer) =>
        CustomerAnonymisedModel.findByIdAndUpdate(
          customer._id,
          anonymiseCustomer(customer)
        )
      )
    );

    res.status(201);
  } catch (error) {
    console.error('Error saving customers:', error);
    res.status(500).json({ error: 'Failed to save customers' });
  }
});

app.listen(3000);
