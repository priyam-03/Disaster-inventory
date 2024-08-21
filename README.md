# Landslides Map

Incident Map is a web application that visualizes incidents on a map, allowing users to filter incidents by state, month, and year. The project is built using Next.js, TypeScript, Prisma, TailwindCSS, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Display incidents on an interactive map.
- Filter incidents by state, month, and year.
- Responsive design using TailwindCSS.
- Full-stack implementation using Next.js and Prisma with MongoDB.

## Tech Stack

- **Next.js**: React framework for server-rendered applications.
- **TypeScript**: Typed JavaScript for better code quality and developer experience.
- **Prisma**: ORM (Object-Relational Mapping) for connecting to MongoDB.
- **MongoDB**: NoSQL database for storing incident data.
- **TailwindCSS**: Utility-first CSS framework for styling.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14 or higher.
- **npm** or **yarn**: Latest version.
- **MongoDB**: A running instance of MongoDB.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/incident-map.git
   cd incident-map
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn install
   ```

3. **Set up the database:**

   Use Prisma to set up the MongoDB database.

   ```bash
   npx prisma migrate dev --name init
   ```

   This command applies any migrations and sets up your MongoDB schema.

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>?retryWrites=true&w=majority"

```

- `DATABASE_URL`: Your MongoDB connection string.

## Running the Project

To run the project locally, use the following command:

```bash
npm run dev
```

Or, if you're using yarn:

```bash
yarn dev
```

This command starts the Next.js development server on `http://localhost:3000`.


## Contributing

Contributions are welcome! Please fork this repository, create a new branch, and submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit your changes:
   ```bash
   git commit -m "Add feature: your feature name"
   ```
5. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
