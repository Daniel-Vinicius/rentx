import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { car as CarFixture } from "@modules/cars/test/fixture/CarFixture";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { rentalFixture } from "@modules/rentals/test/fixtures/RentalFixture";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJsProvider: DayjsDateProvider;

describe("Create Rental", () => {
  beforeEach(() => {
    dayJsProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create(CarFixture);
    const RentalFixture = rentalFixture({ car_id: car.id });

    const rental = await createRentalUseCase.execute(RentalFixture);

    expect(rental).toHaveProperty("start_date");
    expect(rental).toHaveProperty("id");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    const car1 = await carsRepositoryInMemory.create(CarFixture);
    const car2 = await carsRepositoryInMemory.create(CarFixture);
    const RentalFixture = rentalFixture({ car_id: car1.id });

    await createRentalUseCase.execute(RentalFixture);

    await expect(
      createRentalUseCase.execute({ ...RentalFixture, car_id: car2.id })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    const car = await carsRepositoryInMemory.create(CarFixture);
    const RentalFixture = rentalFixture({ car_id: car.id });

    await createRentalUseCase.execute({ ...RentalFixture, user_id: "321" });

    await expect(
      createRentalUseCase.execute({ ...RentalFixture, user_id: "123" })
    ).rejects.toEqual(new AppError("Car is Unavailable"));
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    const car = await carsRepositoryInMemory.create(CarFixture);

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: "ANY_USER_ID",

        expected_return_date: dayjs().add(20, "hours").toDate(),
      })
    ).rejects.toEqual(new AppError("Rent must be at least 24 hours!"));
  });
});
