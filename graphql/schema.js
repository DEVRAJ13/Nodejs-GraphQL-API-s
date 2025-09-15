export const typeDefs = `#graphql
  type User { id: ID!, name: String!, email: String! }
  type AuthPayload { token: String!, user: User! }
  type File {
    id: ID!
    filename: String!
    filepath: String!
    mimetype: String!
    size: Int!
    user: User!
  }

  type Query {
   getUserDocs(userId: ID!, offset: Int, limit: Int): [File]
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    deleteUserDocs(fileId: ID!): String!
  }
`;
