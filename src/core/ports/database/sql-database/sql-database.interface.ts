export abstract class ISqlDatabase {
   abstract query<T extends object>(query: string, params?: unknown[]): Promise<null>;
   abstract query<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T, opts: { isArray: false }): Promise<T | null>;
   abstract query<T extends object>(query: string, params: unknown[], cls: new (...args: any[]) => T, opts: { isArray: true }): Promise<T[]>;
}