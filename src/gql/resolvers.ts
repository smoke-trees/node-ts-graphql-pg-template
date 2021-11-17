import { IResolvers } from '@graphql-tools/utils'
import { UserResponse } from '../@types/gql'
import { ErrorCodes } from '../@types/model'
import log from '../log/log'
import UserModel from '../models/user'
import { GqlContext } from './gqlContext'

export const resolvers: IResolvers = {
  // type resolution when querying
  UserResponse: {
    __resolveType (obj: any, context: GqlContext, info: any) {
      if (!obj.status) {
        return 'OperationResult'
      }

      return 'User'
    }
  },
  // Queries
  Query: {
    // get user by id
    getUserById: async (
      obj: any,
      args: {id: string},
      ctx: GqlContext,
      info: any
    ): Promise<UserResponse> => {
      try {
        const user = await UserModel.readById(ctx.req.context, args.id)

        if (user.findOneObj) {
          log.debug('GQL Query Succeded', 'getUserById', ctx.req.context, { ...args })
          return { ...user.findOneObj }
        }

        log.warn('GQL Query Failed', 'getUserById', ctx.req.context, { ...args })
        return {
          status: user.errorCode,
          message: user.message
        }
      } catch (e) {
        log.error('GQL query failed', 'getUserById', ctx.req.context, e)
        return {
          status: ErrorCodes.UnknownServerError,
          message: 'UnknownServerError while getting the gql query'
        }
      }
    }
  },
  // Mutations
  Mutation: {
    // create user
    createUser: async (
      obj: any,
      args: {
        email: string;
        username: string;
        password: string;
        confirmed: boolean;
        isDisabled: boolean;},
      ctx: GqlContext,
      info: any
    ): Promise<UserResponse> => {
      try {
        const res = await UserModel.create(ctx.req.context, { ...args })

        if (res.insertId) {
          log.debug('GQL Mutation Succeded', 'createUser', ctx.req.context, { ...args })
          return {
            status: res.errorCode,
            message: res.message,
            id: res.insertId
          }
        }

        log.warn('GQL Mutation Failed', 'createUser', ctx.req.context, { ...args })
        return {
          status: res.errorCode,
          message: res.message
        }
      } catch (e) {
        log.error('GQL mutation failed', 'createUser', ctx.req.context, e)
        return {
          status: ErrorCodes.UnknownServerError,
          message: 'UnknownServerError while executing the gql mutation'
        }
      }
    },
    // update user details
    updateUser: async (
      obj: any,
      args: {id: string;
        email: string;
        username: string;
        password: string;
        confirmed: boolean;
        isDisabled: boolean;},
      ctx: GqlContext,
      info: any
    ): Promise<UserResponse> => {
      try {
        const res = await UserModel.update(ctx.req.context, args.id, { ...args, id: undefined })

        if (res.updateId) {
          log.debug('GQL Mutation Succeded', 'updateUser', ctx.req.context, { ...args })
          return {
            status: res.errorCode,
            message: res.message,
            id: res.updateId
          }
        }

        log.warn('GQL Mutation Failed', 'updateUser', ctx.req.context, { ...args })
        return {
          status: res.errorCode,
          message: res.message
        }
      } catch (e) {
        log.error('GQL mutation failed', 'updateUser', ctx.req.context, e)
        return {
          status: ErrorCodes.UnknownServerError,
          message: 'UnknownServerError while executing the gql mutation'
        }
      }
    },
    // delete user by id
    deleteUser: async (
      obj: any,
      args: {id: string},
      ctx: GqlContext,
      info: any
    ): Promise<UserResponse> => {
      try {
        const res = await UserModel.delete(ctx.req.context, args.id)

        if (res.deleteId) {
          log.debug('GQL Mutation Succeded', 'deleteUser', ctx.req.context, { ...args })
          return {
            status: res.errorCode,
            message: res.message,
            id: res.deleteId
          }
        }

        log.warn('GQL Mutation Failed', 'deleteUser', ctx.req.context, { ...args })
        return {
          status: res.errorCode,
          message: res.message
        }
      } catch (e) {
        log.error('GQL mutation failed', 'deleteUser', ctx.req.context, e, { ...args })
        return {
          status: ErrorCodes.UnknownServerError,
          message: 'UnknownServerError while executing the gql mutation'
        }
      }
    }
  }
}
