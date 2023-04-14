import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import http from "http";
import typeDefs from "./graphql/typeDefs"
import resolvers from "./graphql/resolvers";
import dotenv from "dotenv";

dotenv.config();

import { PORT, CLIENT_ORIGIN } from "./config/envConfig"

async function startApolloServer() {
  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = http.createServer(app);

  const corsConfigOptions = {
    origin: CLIENT_ORIGIN,
    credentials: true
  }

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ],
  });

  await server.start();
  server.applyMiddleware({ app, cors: corsConfigOptions });
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, resolve);
  })

  const runningMessage = `Server running at http://localhost:${PORT}${server.graphqlPath}`;
  console.log(runningMessage);
}

startApolloServer().catch((error: any) => console.log(error));