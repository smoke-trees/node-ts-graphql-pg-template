import { ContextType } from '@smoke-trees/smoke-context'

declare global {
  namespace Express {
    export interface Request {
      context: ContextType;
      userId: string;
    }
  }
  export interface Claims {
    userId?: string;
  }
}

export {}
