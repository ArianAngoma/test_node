import {NextFunction, Response, Request} from 'express';

export const loggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
  console.log(req.method);
  console.log(req.path);
  console.log(req.body);

  next();
};
