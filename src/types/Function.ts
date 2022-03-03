export type ExecuteFunction = (options: any) => any;
export interface FunctionType {
   name: string;
   execute: ExecuteFunction;
}
