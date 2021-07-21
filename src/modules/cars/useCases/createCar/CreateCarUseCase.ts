/* eslint-disable consistent-return */
import { inject, injectable } from "tsyringe";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateCarUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    name,
    description,
    brand,
    license_plate,
    category_id,
    daily_rate,
    fine_amount,
  }: ICreateCarDTO): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      license_plate
    );

    if (carAlreadyExists) {
      throw new AppError("Car already exists!");
    }

    try {
      const car = await this.carsRepository.create({
        name,
        description,
        brand,
        license_plate,
        category_id,
        daily_rate,
        fine_amount,
      });

      return car;
    } catch (error) {
      if (error?.code === "23503" && error?.length === 274) {
        throw new AppError("Category ID does not exist!");
      }
    }
  }
}

export { CreateCarUseCase };
