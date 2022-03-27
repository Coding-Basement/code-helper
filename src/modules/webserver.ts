import express from 'express';
import ConsoleLogger from '../utils/consolelogger';

export const app = express();
export const port = process.env.PORT || 8080;

export function listen() {
   app.listen(port, () => {
      new ConsoleLogger(`Listening on port ${port}`).info();
   });
}
