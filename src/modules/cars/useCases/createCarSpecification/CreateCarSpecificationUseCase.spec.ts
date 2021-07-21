import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { car } from "@modules/cars/test/fixture/CarFixture";
import { specification as SpecificationFixture } from "@modules/cars/test/fixture/SpecificationFixture";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should not be able to add a new specification to a now-existent car", async () => {
    await expect(
      createCarSpecificationUseCase.execute({
        car_id: "test",
        specifications_id: ["test"],
      })
    ).rejects.toEqual(new AppError("Car does not exists!", 404));
  });

  it("should be able to add a new specification to the car", async () => {
    const carCreated = await carsRepositoryInMemory.create(car);

    const specification1 = await specificationsRepositoryInMemory.create(
      SpecificationFixture
    );

    const specification2 = await specificationsRepositoryInMemory.create(
      SpecificationFixture
    );

    const specifications_id = [specification1.id, specification2.id];

    const carWithSpecifications = await createCarSpecificationUseCase.execute({
      car_id: carCreated.id,
      specifications_id,
    });

    expect(carWithSpecifications).toHaveProperty("specifications");
    expect(carWithSpecifications.specifications.length).toBe(2);
  });
});
