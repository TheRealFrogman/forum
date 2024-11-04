export interface IJwt {
   generateToken(payload: any): string;
   validateToken(token: string): boolean;
   decodeToken(token: string): any;
}