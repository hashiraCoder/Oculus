// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from './schema';

// // Connection string from our docker-compose.yml setup
// const connectionString = process.env.DATABASE_URL || 'postgres://commitguard_user:super_secret_password_123@localhost:5432/commitguard';

// /**
//  * FAANG-Level Connection Pooling
//  * We do not want to open a new TCP connection to Postgres for every single scan.
//  * We open a pool of 20 connections and reuse them. 
//  */
// const queryClient = postgres(connectionString, { 
//   max: 20,          // Max number of connections in the pool
//   idle_timeout: 20, // Close idle connections after 20 seconds
//   connect_timeout: 10 // Throw an error if DB takes longer than 10s to connect
// });

// // Initialize Drizzle with our schema for fully-typed queries
// export const db = drizzle(queryClient, { schema, logger: process.env.NODE_ENV !== 'production' });


// checkc good practice then remove this