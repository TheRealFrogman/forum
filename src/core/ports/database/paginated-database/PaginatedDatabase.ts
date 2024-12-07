export abstract class PaginatedDatabase {
   abstract getPaginated<T extends object>(
      table: string,
      clazz: new (...args: any[]) => T,
      page: number,
      pageSize: number,
      orderBy: keyof T,
      direction: "ascending" | "descending",
      conditions?: string,
      conditionsParams?: any[],
   ): Promise<T[]>
   abstract getPaginated<T extends object>(
      table: string,
      clazz: new (...args: any[]) => T,
      page: number,
      pageSize: number,
      orderBy: keyof T,
      direction: "ascending" | "descending",
      conditions: string,
      conditionsParams: any[],
   ): Promise<T[]>
}