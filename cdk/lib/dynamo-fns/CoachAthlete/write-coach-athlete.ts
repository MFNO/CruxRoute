import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { CoachAthlete } from "./coach-athlete-table";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const body = event.body;
  if (body) {
    const test = JSON.parse(body);
    //const coachAthlete = await CoachAthlete.create(JSON.parse(body));
    return {
      body: JSON.stringify(test),
      statusCode: 200,
    };
  }
  return { body: "Error, invalid input!", statusCode: 400 };
};
