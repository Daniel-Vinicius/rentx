import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Fields email or password missing!" });
    }

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const { token, user, refresh_token } =
      await authenticateUserUseCase.execute({
        email,
        password,
      });

    return response.status(200).json({ user, token, refresh_token });
  }
}

export { AuthenticateUserController };
