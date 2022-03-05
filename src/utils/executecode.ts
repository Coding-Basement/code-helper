import { credentials } from './../config/ranna';
import axios from 'axios';
import { baseUrl } from '../config/ranna';

interface Result {
   exectimems: number;
   stderr: string;
   stdout: string;
}

export async function executeCode({
   language,
   code,
}: {
   language: string;
   code: string;
}) {
   let err = false;
   const response = await axios
      .post<Result>(
         baseUrl + '/v1/exec',
         {
            code,
            language,
         },
         {
            headers: {
               Authorization: 'Basic ' + credentials,
            },
         },
      )
      .catch((error) => {
         err = true;
      });

   if (err || !response?.data) {
      return null;
   }

   return response.data;
}
