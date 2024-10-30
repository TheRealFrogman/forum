export interface IRepository<T> {
   findOne(id: number): Promise<T | null>;
   findOneBy(mask: { [key in keyof T]?: T[key] }): Promise<T | null>;
   findAll(): Promise<T[]>;
   create(data: Omit<{ [key in keyof T]?: T[key] }, 'id'>): Promise<T>;
   update(id: number, data: { [key in keyof T]?: T[key] }): Promise<T | null>;
   remove(id: number): Promise<void>;
   query(query: string, values?: unknown[]): Promise<any>;
}