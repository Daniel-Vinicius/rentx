import dayjs from "dayjs";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";

interface IRentalFixtureProps {
  car_id: string;
  user_id?: string;
  expected_return_date?: Date;
}

export function rentalFixture({
  user_id,
  car_id,
  expected_return_date,
}: IRentalFixtureProps): ICreateRentalDTO {
  return {
    user_id: user_id || "12345",
    car_id,
    expected_return_date:
      expected_return_date || dayjs().add(3, "day").toDate(),
  };
}
