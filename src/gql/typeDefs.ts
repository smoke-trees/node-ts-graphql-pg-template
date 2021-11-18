import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type OperationResult {
    status: Int!
    message: String!
    id: ID
  }

  type User {
    id: ID!
    email: String!
    username: String!
    password: String!
    confirmed: Boolean!
    isDisabled: Boolean!
  }

  union UserResponse = OperationResult | User

  type Query {
    getUserById(id: ID!): UserResponse
  }

  type Mutation {
    createUser(
    email: String!
    username: String!
    password: String!
    confirmed: Boolean!
    isDisabled: Boolean!): OperationResult
    updateUser(id: ID!
    email: String
    username: String
    password: String
    confirmed: Boolean
    isDisabled: Boolean!): OperationResult
    deleteUser(id: ID!): OperationResult
  }
`
