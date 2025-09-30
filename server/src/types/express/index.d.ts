declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      socket?: {
        id: string;
      };
    }
  }
}

export {};
