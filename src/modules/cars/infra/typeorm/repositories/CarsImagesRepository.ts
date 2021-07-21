import { getRepository, Repository } from "typeorm";

import { ICreateCarsImageDTO } from "@modules/cars/dtos/ICreateCarsImageDTO";
import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";

class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(data: ICreateCarsImageDTO): Promise<CarImage> {
    const carImage = this.repository.create(data);
    await this.repository.save(carImage);

    return carImage;
  }
}

export { CarsImagesRepository };
