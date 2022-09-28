import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { CoachAthlete } from "./coach-athlete-table";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const userPoolId = process.env.userPoolId;

  if (event.pathParameters) {
    const athleteId = event.pathParameters.athleteId;
    const coachAthleteResponse = await CoachAthlete.get(
      {
        athleteId: athleteId,
      },
      { index: "gs1" }
    );

    if (!coachAthleteResponse) {
      return { body: "Error, resource not found", statusCode: 404 };
    }

    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
    });

    const cognitoResponse = await client.send(command);

    const cognitoAthlete = cognitoResponse.Users?.find(
      (user) => user.Username === coachAthleteResponse?.coachId
    );

    const response = {
      ...cognitoAthlete,
      linked: coachAthleteResponse?.linked,
    };

    return {
      body: JSON.stringify(response),
      statusCode: 200,
    };
  } else {
    return { body: "Error, resource not found", statusCode: 404 };
  }
};
