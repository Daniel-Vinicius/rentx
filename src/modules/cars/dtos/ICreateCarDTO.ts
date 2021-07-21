import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

interface ICreateCarDTO {
  name: string;
  description: string;
  brand: string;
  license_plate: string;
  category_id: string;

  daily_rate: number;
  fine_amount: number;

  specifications?: Specification[];
  id?: string;
}

export { ICreateCarDTO };
