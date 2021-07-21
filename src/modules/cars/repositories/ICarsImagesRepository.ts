import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";

import { ICreateCarsImageDTO } from "../dtos/ICreateCarsImageDTO";

interface ICarsImagesRepository {
  create(data: ICreateCarsImageDTO): Promise<CarImage>;
}

export { ICarsImagesRepository };
