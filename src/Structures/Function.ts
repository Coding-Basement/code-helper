import { FunctionType } from '../types/Function';

export class Function {
   constructor(functionOptions: FunctionType) {
      Object.assign(this, functionOptions);
   }
}
