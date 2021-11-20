import './config'
import cors from 'cors'
import express from 'express'
import './database/connection'
import morgan from './log/morgan'
import compression from 'compression'
import { typeDefs } from './gql/typeDefs'
import { resolvers } from './gql/resolvers'
import context from '@smoke-trees/smoke-context'
import { makeExecutableSchema } from 'graphql-tools'
import { ApolloServer } from 'apollo-server-express'

const app = express()

// Middleware chain
app.use(express.json())
app.use(compression())
app.use(context({ headerName: 'test' }))
app.use(cors())

// Logging
app.use(morgan)

// GQL
const schema = makeExecutableSchema({ typeDefs, resolvers })
export const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }: any) => ({ req, res })
})

export default app
