import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  router  from './routers/router.js';
import { connectDB } from "./database/database.js";
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { verifyToken } from "./util/util.js";


dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(router);


try {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      const userId = await verifyToken(token);
      return { userId };
    },
  });

  await server.start();
  await connectDB();
  console.log("Database synchronized");
  server.applyMiddleware({ app, path: "/graphql" });
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server running at http://localhost:${port}${server.graphqlPath}`));
} catch (error) {
  console.error("Server start error:", error);
}
