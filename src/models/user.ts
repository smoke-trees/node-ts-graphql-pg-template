import { ContextType } from '@smoke-trees/smoke-context'
import { getConnection, ObjectLiteral } from 'typeorm'
import { CreatedModelResponse, DeletedModelResponse, ErrorCodes, ReadModelResponse, UpdatedModelResponse } from '../@types/model'
import { UserInterface } from '../@types/user'
import UserEntity from '../database/entity/user'
import log from '../log/log'
import aes from '../middleware/aes'
import Validators from '../validators/validators'

const checkBeforeInserting = (email: string, password: string): { check: boolean; message?: string } => {
  const passwordCheck = Validators.checkIfPasswordIsValid(password)
  if (!passwordCheck.isValid) {
    return {
      check: false,
      message: passwordCheck.message
    }
  }

  const emailCheck = Validators.checkifEmailIsValid(email)
  if (emailCheck !== '') {
    return {
      check: false,
      message: emailCheck
    }
  }

  return {
    check: true
  }
}

// User Model Actions
export default class UserModel {
  /**
     * Create User
     * @param context context object to be passed in a service
     * @param user User Object to be created
     */
  static async create (context: ContextType, user: UserInterface): Promise<CreatedModelResponse> {
    // check for valid entry from request
    const checkValidEntry = checkBeforeInserting(user.email, user.password)
    if (!checkValidEntry.check) {
      return {
        message: checkValidEntry.message!,
        errorCode: ErrorCodes.BadRequest
      }
    }

    // encryption
    user.username = aes.encrypt(user.username)
    user.password = aes.encrypt(user.password)
    user.email = aes.encrypt(user.email)

    try {
      const userEntity = new UserEntity(user)

      await getConnection().transaction(async (transactionEntityManager) => {
        await transactionEntityManager.save(userEntity)
      })

      if (!userEntity.id) {
        log.debug('User could not be created', 'User/create', context, user)
        return {
          errorCode: ErrorCodes.NoUpdatesPerformed,
          message: 'User Could not be updated'
        }
      }

      log.debug('User created', 'User/create', context, user)
      return {
        errorCode: ErrorCodes.Created,
        message: 'User Created Successfully',
        insertId: userEntity.id
      }
    } catch (error) {
      log.error('User could not be Created', 'User/create', context, error, user)
      return {
        errorCode: ErrorCodes.UnknownServerError,
        message: 'Error while creating User'
      }
    }
  }

  /**
     * Read a user By Id
     * @param context context object to be passed in a service
     * @param id id to get user by
     */
  static async readById (context: ContextType, id: string): Promise<ReadModelResponse<UserInterface>> {
    try {
      const result = await getConnection().getRepository(UserEntity)
        .findOne(id,
          {
            cache: true
          })

      if (!result) {
        log.warn('User could not be found', 'User/readById', context, id)
        return {
          errorCode: ErrorCodes.NotFound,
          message: 'Error while finding id'
        }
      }

      log.debug('User found', 'User/readById', context, id)
      return {
        errorCode: ErrorCodes.Success,
        message: 'User Found',
        findOneObj: {
          ...result,
          username: aes.decrypt(result.username),
          email: aes.decrypt(result.email),
          password: aes.decrypt(result.password)
        }
      }
    } catch (error) {
      log.error('User could not be found by id', 'User/readById', context, error, id)
      return {
        errorCode: ErrorCodes.UnknownServerError,
        message: 'Error while finding User'
      }
    }
  }

  /**
     * Delete a user by id
     * @param context context object to be passed in a service
     * @param userId userId to delete user by
     */
  static async delete (context: ContextType, userId: string): Promise<DeletedModelResponse> {
    try {
      const { ...res1 } = await getConnection().getRepository(UserEntity)
        .delete({ id: userId })

      if (res1.affected !== 1) {
        log.warn('User found but not deleted', 'User/delete', context, userId)
        return {
          errorCode: ErrorCodes.NoUpdatesPerformed,
          message: 'User could not be deleted'
        }
      }

      log.debug('User deleted', 'User/delete', context, userId)
      return {
        errorCode: ErrorCodes.Success,
        message: 'User Deleted',
        deleteId: userId
      }
    } catch (error) {
      log.error('User could not be deleted', 'User/delete', context, error, userId)
      return {
        errorCode: ErrorCodes.UnknownServerError,
        message: 'Error while deleting User'
      }
    }
  }

  /**
     * Update user by userId
     * @param context context object to be passed in a service
     * @param userId userId to update user by
     * @param user user interface to update user by
     */
  static async update (context: ContextType, userId: string, user: UserInterface): Promise<UpdatedModelResponse> {
    // check for valid entry from request
    const checkValidEntry = checkBeforeInserting(user.email, user.password)
    if (!checkValidEntry.check) {
      return {
        message: checkValidEntry.message!,
        errorCode: ErrorCodes.BadRequest
      }
    }

    // encryption
    user.username = aes.encrypt(user.username)
    user.email = aes.encrypt(user.email)
    user.password = aes.encrypt(user.password)

    try {
      const { affected } = await getConnection().getRepository(UserEntity)
        .update({ id: userId }, user)
      if (affected === 1) {
        log.debug('User Updated', 'User/update', context, user, userId)
        return {
          errorCode: ErrorCodes.Success,
          message: 'User was Updated',
          updateId: userId
        }
      }
      log.warn('User found but not updated', 'User/update', context, user, userId)
      return {
        errorCode: ErrorCodes.NoUpdatesPerformed,
        message: 'User could not be Updated'
      }
    } catch (error) {
      log.error('User could not be Updated', 'User/update', context, error, user, userId)
      return {
        errorCode: ErrorCodes.UnknownServerError,
        message: 'Error while updating User'
      }
    }
  }
}
