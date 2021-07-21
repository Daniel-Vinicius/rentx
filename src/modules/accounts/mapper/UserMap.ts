import { classToClass } from "class-transformer";

import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
  static toDTO(userParameter: User): IUserResponseDTO {
    const { id, name, email, avatar, driver_license, avatar_url } =
      userParameter;

    const user = {
      id,
      name,
      email,
      avatar,
      driver_license,
      avatar_url,
    };

    const userResult = classToClass(user);

    return userResult;
  }
}

export { UserMap };
