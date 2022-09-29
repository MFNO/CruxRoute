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
  if (event.pathParameters) {
    const coachId = event.pathParameters.coachId;
    const coachAthleteResponse = await CoachAthlete.find({
      coachId: coachId,
    });

    if (coachAthleteResponse) {
      return {
        body: JSON.stringify(coachAthleteResponse),
        statusCode: 200,
      };
    }
    return { body: "Error, resource not found", statusCode: 404 };
  }
  return { body: "Error, incorrect request", statusCode: 400 };
};
