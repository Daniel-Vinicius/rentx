import { Category } from "@modules/cars/infra/typeorm/entities/Category";

import { ICreateCategoryDTO } from "../dtos/ICreateCategoryDTO";

interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
}

export { ICategoriesRepository };
