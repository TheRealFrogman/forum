export interface IMyDatabase {
   query<T>(cls: new (...args: any[]) => T, query: string, params?: unknown[]): Promise<T | T[] | null>;
}