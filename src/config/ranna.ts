export const baseUrl = 'https://ranna.mxgnus.de';
export const credentials = Buffer.from(
   process.env.RANNA_AUTH_USERNAME + ':' + process.env.RANNA_AUTH_PASSWORD,
).toString('base64');
