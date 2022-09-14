import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";
import Dynamo from "dynamodb-onetable/Dynamo";

const client = new Dynamo({ client: new DynamoDBClient({}) });

const schema = {
  indexes: {
    primary: {
      hash: "pk",
      sort: "sk",
    },
  },
  models: {
    event: {
      type: {
        required: true,
        type: "string",
        value: "event",
      },
      pk: {
        type: "string",
        value: "id",
      },
      sk: {
        type: "string",
        value: "${date}",
      },
      id: {
        required: true,
        type: "string",
      },
      date: {
        required: true,
        type: "string",
      },
      description: {
        required: true,
        type: "string",
      },
    },
  },
  version: "0.1.0",
  params: {
    typeField: "type",
  },
  format: "onetable:1.0.0",
} as const;

export type EventType = Entity<typeof schema.models.event>;

const table = new Table({
  client,
  name: "EventTable",
  schema,
  timestamps: true,
});

export const Event = table.getModel<EventType>("event");
