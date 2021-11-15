import { ErrorCodes } from '../model'
import { UserInterface } from '../user'

export interface OperationResult {
  status: ErrorCodes;
  message: string;
  id?: string;
}

export type UserResponse = OperationResult | UserInterface
