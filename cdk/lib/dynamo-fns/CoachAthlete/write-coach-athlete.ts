import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { CoachAthlete } from "./coach-athlete-table";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const body = event.body;
  if (body) {
    const userPoolId = process.env.userPoolId;

    const request = JSON.parse(body);

    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      AttributesToGet: ["email"],
    });

    const response = await client.send(command);

    const cognitoAthlete = response.Users?.find((user) =>
      user.Attributes?.some(
        (attribute) =>
          attribute.Name === "email" && attribute.Value === request.athleteEmail
      )
    );

    if (cognitoAthlete && cognitoAthlete.Username) {
      const coachAthlete = await CoachAthlete.create({
        athleteId: cognitoAthlete.Username,
        coachId: request.coachId,
        linked: request.linked,
      });

      return {
        body: JSON.stringify(coachAthlete),
        statusCode: 200,
      };
    }
  }
  return { body: "Error, invalid input!", statusCode: 400 };
};
