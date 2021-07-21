import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarUseCase } from "./CreateCarUseCase";

class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      brand,
      license_plate,
      category_id,
      daily_rate,
      fine_amount,
    } = request.body;

    if (
      !name ||
      !description ||
      !brand ||
      !license_plate ||
      !category_id ||
      !daily_rate ||
      !fine_amount
    ) {
      return response.status(400).json({
        message:
          "Fields name or description or brand or license_plate or category_id or daily_rate or fine_amount missing.",
      });
    }

    const createCarUseCase = container.resolve(CreateCarUseCase);

    const car = await createCarUseCase.execute({
      name,
      description,
      brand,
      license_plate,
      category_id,
      daily_rate,
      fine_amount,
    });

    return response.status(201).json(car);
  }
}

export { CreateCarController };
