import { Request, Response } from "express";
import { container } from "tsyringe";
import { validate } from "uuid";

import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

interface IFiles {
  filename: string;
}

class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFiles[];

    if (!images) {
      return response.status(400).json({ error: "Field images missing" });
    }

    if (!validate(id)) {
      return response.status(400).json({ error: "UUID is invalid" });
    }

    const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);

    const fileNames = images.map((file) => file.filename);

    await uploadCarImagesUseCase.execute({
      car_id: id,
      images_name: fileNames,
    });

    return response.status(201).send();
  }
}

export { UploadCarImagesController };
