/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SES } from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);
    let AWSEmail = "";

    const ses = new SES({
      apiVersion: "2010-12-01",
      region: process.env.AWS_REGION,
    });

    const identities = await ses
      .listIdentities({
        IdentityType: "EmailAddress",
      })
      .promise();

    const [awsEmail] = identities.Identities;
    AWSEmail = awsEmail;

    await this.client.sendMail({
      to,
      from: `Rentx <${AWSEmail}>`,
      subject,
      html: templateHTML,
    });
  }
}

export { SESMailProvider };
