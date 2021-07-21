import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

import { ICreateSpecificationDTO } from "../dtos/ICreateSpecificationDTO";

interface ISpecificationsRepository {
  create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification>;
  findByName(name: string): Promise<Specification>;
  list(): Promise<Specification[]>;
  findByIds(ids: string[]): Promise<Specification[]>;
}

export { ISpecificationsRepository };
