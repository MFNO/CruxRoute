import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";
import Dynamo from "dynamodb-onetable/Dynamo";

const client = new Dynamo({ client: new DynamoDBClient({}) });

const schema = {
  indexes: {
    primary: {
      hash: "id",
      sort: "personId",
    },
  },
  models: {
    TrainingEvent: {
      type: {
        required: true,
        type: "string",
        value: "TrainingEvent",
      },
      id: {
        required: true,
        type: "string",
      },
      personId: {
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

export type TrainingEventType = Entity<typeof schema.models.TrainingEvent>;

const table = new Table({
  client,
  name: "dev-TrainingEventTable",
  schema,
  timestamps: true,
});

export const TrainingEvent = table.getModel<TrainingEventType>("TrainingEvent");
