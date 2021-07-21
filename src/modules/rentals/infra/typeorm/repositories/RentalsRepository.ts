import { getRepository, Repository } from "typeorm";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rentalOpenByCar = await this.repository.findOne({
      where: { car_id, end_date: null },
    });

    return rentalOpenByCar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rentalOpenByUser = await this.repository.findOne({
      where: { user_id, end_date: null },
    });

    return rentalOpenByUser;
  }

  async create({
    id,
    end_date,
    start_date,
    car_id,
    user_id,
    total,
    created_at,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      id,
      user_id,
      car_id,
      created_at: created_at || new Date(),
      total: total || null,
      expected_return_date,
      end_date: end_date || null,
      start_date: start_date || new Date(),
    });

    await this.repository.save(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const rentalSearchedById = await this.repository.findOne({ id });
    return rentalSearchedById;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: {
        user_id,
      },
      relations: ["car"],
    });

    return rentals;
  }
}

export { RentalsRepository };
