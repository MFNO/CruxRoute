import type { APIGatewayProxyResultV2 } from "aws-lambda";

import { TrainingEvent } from "./training-event-table";

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  const event = await TrainingEvent.scan();
  return {
    body: JSON.stringify(event),
    statusCode: 200,
  };
};
