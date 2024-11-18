
export abstract class IEncryptHash {
   abstract hash(password: string): Promise<string>;
   abstract compare(comparePassword: string, hashedPassword: string): Promise<boolean>;
}
// export type HashedPassword = `${string}:${string}`;