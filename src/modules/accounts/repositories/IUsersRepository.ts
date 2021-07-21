import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { ICreateUsersDTO } from "../dtos/ICreateUsersDTO";

interface IUsersRepository {
  create(data: ICreateUsersDTO): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
}

export { IUsersRepository };
