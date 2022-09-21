import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";
import Dynamo from "dynamodb-onetable/Dynamo";

const client = new Dynamo({ client: new DynamoDBClient({}) });

const schema = {
  indexes: {
    primary: {
      hash: "coachId",
      sort: "personId",
    },
    gs1: {
      hash: "personId",
      sort: "coachId",
    },
  },
  models: {
    CoachAthlete: {
      type: {
        required: true,
        type: "string",
        value: "CoachAthlete",
      },
      personId: {
        required: true,
        type: "string",
      },
      coachId: {
        required: true,
        type: "string",
      },
      linked: {
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

export type CoachAthleteType = Entity<typeof schema.models.CoachAthlete>;

const table = new Table({
  client,
  name: "dev-CoachAthlete",
  schema,
  timestamps: true,
});

export const CoachAthlete = table.getModel<CoachAthleteType>("CoachAthlete");
