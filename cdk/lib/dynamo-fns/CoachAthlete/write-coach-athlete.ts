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
    const userPoolClientId = process.env.userPoolClientId;
    const userPoolId = process.env.userPoolId;

    const test = JSON.parse(body);
    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      AttributesToGet: ["email"],
    });

    const response = await client.send(command);

    test.response = response;
    //const coachAthlete = await CoachAthlete.create(JSON.parse(body));
    return {
      body: JSON.stringify(test),
      statusCode: 200,
    };
  }
  return { body: "Error, invalid input!", statusCode: 400 };
};
