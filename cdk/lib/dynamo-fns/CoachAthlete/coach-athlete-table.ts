import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Table } from "dynamodb-onetable";
import Dynamo from "dynamodb-onetable/Dynamo";

const client = new Dynamo({ client: new DynamoDBClient({}) });

const schema = {
  indexes: {
    primary: {
      hash: "coachId",
      sort: "athleteId",
    },
    gs1: {
      hash: "athleteId",
      sort: "coachId",
    },
  },
  models: {
    CoachAthlete: {
      type: {
        required: true,
        type: String,
        value: "CoachAthlete",
      },
      athleteId: {
        required: true,
        type: String,
      },
      coachId: {
        required: true,
        type: String,
      },
      athleteMail: {
        required: true,
        type: String,
      },
      coachMail: {
        required: true,
        type: String,
      },
      linked: {
        required: true,
        type: Boolean,
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
  name: "CoachAthleteTable",
  schema,
  timestamps: true,
});

export const CoachAthlete = table.getModel<CoachAthleteType>("CoachAthlete");
