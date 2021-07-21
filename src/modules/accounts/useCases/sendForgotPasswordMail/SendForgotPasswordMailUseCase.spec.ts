import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { user as userFixture } from "@modules/accounts/test/fixture/UserFixture";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("Must do email validation", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("INVALID_EMAIL")
    ).rejects.toEqual(new AppError("Invalid email"));
  });

  it("You must not send the email if the user does not exist", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute(userFixture.email)
    ).rejects.toEqual(new AppError("User does not exists.", 404));
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create(userFixture);

    await sendForgotPasswordMailUseCase.execute(userFixture.email);

    expect(sendMail).toHaveBeenCalled();
  });

  it("should be able to create an users token", async () => {
    await usersRepositoryInMemory.create(userFixture);

    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await sendForgotPasswordMailUseCase.execute(userFixture.email);
    expect(generateTokenMail).toBeCalled();
  });
});
