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
    gs1: {
      hash: "personId",
      sort: "id",
    },
  },
  models: {
    TrainingEvent: {
      type: {
        required: true,
        type: String,
        value: "TrainingEvent",
      },
      id: {
        required: true,
        type: String,
      },
      personId: {
        required: true,
        type: String,
      },
      date: {
        required: true,
        type: String,
      },
      description: {
        required: true,
        type: String,
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
  name: "TrainingEventTable",
  schema,
  timestamps: true,
});

export const TrainingEvent = table.getModel<TrainingEventType>("TrainingEvent");
