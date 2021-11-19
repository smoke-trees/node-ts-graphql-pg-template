import app, { apolloServer } from './app'
import http from 'http'
import logger from './log/log'

const PORT: number = Number(process.env.PORT) || 8080

const server = http.createServer(app)

server.listen(PORT, async (): Promise<void> => {
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })
  logger.info(`started server on port ${PORT}`)
})
