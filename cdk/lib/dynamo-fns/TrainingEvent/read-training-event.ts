import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { TrainingEvent } from "./training-event-table";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (event.pathParameters) {
    const personId = event.pathParameters.personId;
    const response = await TrainingEvent.find(
      {
        personId: personId,
      },
      { index: "gs1" }
    );
    return {
      body: JSON.stringify(response),
      statusCode: 200,
    };
  } else {
    return { body: "Error, resource not found", statusCode: 400 };
  }
};
