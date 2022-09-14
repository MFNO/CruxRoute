import type { APIGatewayProxyResultV2 } from "aws-lambda";

import { Event } from "./event-table";

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  const event = await Event.scan();
  return { body: JSON.stringify(event), statusCode: 200 };
};
