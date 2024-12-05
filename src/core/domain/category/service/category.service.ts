import { Category } from "../entities/category.entity";
import { NewCategoryDto } from "../dto/new-category.dto";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { inject, injectable } from "inversify";

@injectable()
export class CategoryService {
   constructor(@inject(ISqlDatabase) private readonly database: ISqlDatabase) { }

   async addCategory(newCategoryDto: NewCategoryDto): Promise<Category> {
      const result = await this.database.query(
         `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
         [newCategoryDto.name],
         Category,
         { isArray: false }
      );
      return result!;
   }

   async deleteCategory(categoryId: Category['id']): Promise<Category | null> {
      const result = await this.database.query(
         `DELETE FROM categories WHERE id = $1 RETURNING *`,
         [categoryId],
         Category,
         { isArray: false }
      );
      return result;
   }
   async getCategory(categoryId: Category['id']): Promise<Category | null> {
      const result = await this.database.query(
         `SELECT * FROM categories WHERE id = $1`,
         [categoryId],
         Category,
         { isArray: false }
      );
      return result;
   }
}