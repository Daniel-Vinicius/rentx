import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, driver_license } = request.body;

    if (!email || !password || !driver_license || !name) {
      return response.status(400).json({
        error: "Fields email or password or name or driver_license missing!",
      });
    }

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const data = {
      name,
      email,
      password,
      driver_license,
    };

    await createUserUseCase.execute(data);

    return response.status(201).send();
  }
}

export { CreateUserController };
