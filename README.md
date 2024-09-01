# Fake Customer Data Generator and Anonymizer

This project is a server application designed to generate fake customer data and create anonymized versions of that data. The application has two main components: a client part and a server part.

## Features

- **Fake Data Generation**: Generates random customer data for testing and development purposes.
- **Data Anonymization**: Anonymizes customer data to ensure privacy and compliance with data protection regulations.
- **Client-Server Architecture**: The client sends a bulk object (1-10 customer objects) to the server, which processes and stores the data.

## Getting Started

### Prerequisites

- Node.js (version 21 or higher)
- MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the necessary packages:
   ```bash
   npm install
   ```

### Build the Project

Before running the server, you need to build the project:

```bash
npm run build
```

### Configuration

Update the `.env` file with your MongoDB connection URL:

```
DB_URI=<your-mongodb-url>
```

### Running the Server

To start the server, run:

```bash
npm run start
```

## Usage

- The client sends a bulk object of 1-10 customer objects to the server.
- The server receives this data, adds it to the primary database, and creates anonymized versions in a separate collection.

## Project Structure

- **server.ts**: The main server file that handles client requests and processes customer data.
- **customer.model.ts**: Defines the MongoDB schemas for customer data. 
  - **CustomerSchema**: The schema for storing detailed customer information, including name, email, and address. 
  - **CustomerAnonymisedModel**: A clone of the `CustomerSchema` used to store anonymized customer data, ensuring sensitive information is protected.
