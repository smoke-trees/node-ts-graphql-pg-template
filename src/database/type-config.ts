import { ConnectionOptions } from 'typeorm'
import UserEntity from './entity/user'

const config: ConnectionOptions = {
  type: 'postgres',
  port: 5432,
  database: process.env.PGDATABASE ?? 'postgres',
  host: process.env.PGHOST ?? '172.17.0.1',
  username: process.env.PGUSER ?? 'postgres',
  password: process.env.PGPASSWORD ?? 'mysecretpassword',
  entities: [
    UserEntity
  ],
  migrations: [
    'src/migration/**/*.ts'
  ],
  subscribers: [
    'src/subscriber/**/*.ts'
  ],
  synchronize: true,
  logging: ['error', 'migration'],
  cache: {
    type: 'redis',
    options: {
      host: 'localhost',
      port: 6379
    },
    ignoreErrors: true
  }
}

export default config
