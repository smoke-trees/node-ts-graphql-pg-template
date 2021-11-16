import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import log from '../log/log'

const secret = process.env.JWT_SECRET ?? 'default'

const getToken = (authorization: string | null): string | null => {
  if (!authorization) {
    return null
  }
  if (!(authorization.split(' ')[0] === 'Bearer')) {
    return null
  }
  const token = authorization.split(' ')[1]
  return token
}

export const AuthenticationHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = getToken(req.get('Authorization') ?? null)
  if (token === null) {
    res.status(403).json({ message: 'Authorization Header missing' })
    return
  }
  try {
    const claims = jwt.verify(token, secret)
    const { userId } = claims as Claims
    if (!userId) {
      res.status(403).json({ message: 'User Id not found in header' })
      return
    }
    req.userId = userId
    next()
  } catch (error) {
    log.error('Error in authentication', 'AuthenticationHandler', req.context, error)
    res.status(403).json({ message: 'User Id not found in header' })
  }
}
