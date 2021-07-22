import { Request, Response } from "express";
import { container } from "tsyringe";

import { ResetPasswordUserUseCase } from "./ResetPasswordUserUseCase";

class ResetPasswordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    if (!password) {
      return response.status(400).json({
        message: "Error - Fields password missing!",
      });
    }

    const resetPasswordUserUseCase = container.resolve(
      ResetPasswordUserUseCase
    );

    await resetPasswordUserUseCase.execute({ token: String(token), password });

    return response.json({
      message: "Password changed successfully",
    });
  }
}

export { ResetPasswordUserController };
