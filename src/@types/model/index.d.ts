export const enum ErrorCodes {
  Success = '200',
  Created = '201',
  BadRequest = '400',
  NotAuthorized = '401',
  NotFound = '404',
  NoUpdatesPerformed = '1002',
  UnknownServerError = '500',
}

interface ModelResponse {
  errorCode: ErrorCodes;
  message: string;
}

export interface CreatedModelResponse extends ModelResponse {
  insertId?: string;
}

export interface DeletedModelResponse extends ModelResponse {
  deleteId?: string;
}

export interface UpdatedModelResponse extends ModelResponse {
  updateId?: string;
}

export interface ReadModelResponse<T> extends ModelResponse {
  findOneObj?: T;
  findManyObjs?: T[];
}
