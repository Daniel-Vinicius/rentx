import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it("should be able to create a new category", async () => {
    const newCategory = {
      name: "Category Test",
      description: "Category description Test",
    };

    await createCategoryUseCase.execute(newCategory);

    const categoryCreated = await categoriesRepositoryInMemory.findByName(
      newCategory.name
    );

    expect(categoryCreated).toHaveProperty("id");
  });

  it("should not be able to create a new category with name exists", async () => {
    const newCategory = {
      name: "Category Test",
      description: "Category description Test",
    };

    await createCategoryUseCase.execute(newCategory);

    await expect(createCategoryUseCase.execute(newCategory)).rejects.toEqual(
      new AppError("Category already exists!")
    );
  });
});
