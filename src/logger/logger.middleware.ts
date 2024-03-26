import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    console.log("METHOD:  ", method);
    console.log("URL:  ", originalUrl);
    console.log("QUERY:  ", query);
    console.log("BODY:  ", body);
    console.log("RESPONSE:  ", res.statusCode)
    next();
  }
}
