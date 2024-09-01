import mongoose, { Document, Schema } from 'mongoose';

type TAddress = {
  line1: string;
  line2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
};

export type TCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  address: TAddress;
};

const AddressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  postcode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const CustomerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: AddressSchema, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const CustomerModel = mongoose.model<TCustomer>(
  'customers',
  CustomerSchema
);

export const CustomerAnonymisedModel = mongoose.model<TCustomer>(
  'customers_anonymised',
  CustomerSchema.clone()
);
