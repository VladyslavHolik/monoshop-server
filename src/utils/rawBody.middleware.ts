import { Response } from 'express';
import { json } from 'body-parser';
import RequestWithRawBody from './types/requestWithRawBody.interface';

// Raw body for stripe webhook
function rawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      response: Response,
      buffer: Buffer,
    ) => {
      if (request.url === '/webhook' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}

export default rawBodyMiddleware;
