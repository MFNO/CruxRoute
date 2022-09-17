import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { TrainingEvent } from "./training-event-table";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (event.pathParameters) {
    const trainingEventId = event.pathParameters.eventId;
    const personId = event.pathParameters.personId;
    const response = await TrainingEvent.remove({
      id: trainingEventId,
      personId: personId,
    });
    return {
      body: JSON.stringify(response),
      statusCode: 200,
    };
  }
  return { body: "Error, invalid input!", statusCode: 400 };
};
