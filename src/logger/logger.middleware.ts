import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    const requestData = `Response: method ${method}, originalUrl ${originalUrl}, query ${JSON.stringify(
      query,
    )}, body ${JSON.stringify(body)},`;

    res.on('finish', () => {
      this.loggingService.log(`${requestData} status code ${res.statusCode}`);
    });

    next();
  }
}
