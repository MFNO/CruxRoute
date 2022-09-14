import type { APIGatewayProxyResultV2 } from "aws-lambda";

import { Event } from "./event-table";

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  const event = await Event.find({ pk: "id" }, { limit: 10, reverse: true });
  return { body: JSON.stringify(event), statusCode: 200 };
};
