
export interface IEncryptHash {
   hash(password: string): Promise<string>;
   compare(comparePassword: string, hashedPassword: string): Promise<boolean>;
}
// export type HashedPassword = `${string}:${string}`;