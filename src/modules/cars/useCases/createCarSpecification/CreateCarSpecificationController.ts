import { Request, Response } from "express";
import { container } from "tsyringe";
import { validate } from "uuid";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

class CreateCarSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { specifications_id } = request.body;

    if (!specifications_id) {
      return response
        .status(400)
        .json({ error: "Field specifications_id missing" });
    }

    if (!validate(id)) {
      return response.status(400).json({ error: "UUID is invalid" });
    }

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase
    );

    const car = await createCarSpecificationUseCase.execute({
      car_id: id,
      specifications_id,
    });

    return response.json(car);
  }
}

export { CreateCarSpecificationController };
