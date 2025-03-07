import express, { Request, Response } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server'; // Apollo Server
import { expressMiddleware } from '@apollo/server/express4'; // Express 4 middleware
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  // Start the Apollo server
  await server.start();

  // Connect to the database
  await db();

  // Set up Express app
  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware for parsing
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apollo server as middleware
  app.use(
    '/graphql',
    expressMiddleware(server as any,
    {
      context: authenticateToken as any, // Token authentication middleware
    })
  );

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), '../client/dist')));

    // Handle routing for React app in production
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(process.cwd(), '../client/dist/index.html'));
    });
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
