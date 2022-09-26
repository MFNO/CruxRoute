import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { RemovalPolicy, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

interface CreateCruxRouteCoachAthleteLambdaStackProps extends StackProps {
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;
  readonly apiCorsAllowedOrigins: string[];
}

export class CreateCruxRouteCoachAthleteLambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CreateCruxRouteCoachAthleteLambdaStackProps
  ) {
    super(scope, id, props);

    const coachAthleteTable = new Table(this, id, {
      billingMode: BillingMode.PROVISIONED,
      partitionKey: { name: "coachId", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: "personId", type: AttributeType.STRING },
      tableName: "CoachAthleteTable",
    });

    coachAthleteTable.addGlobalSecondaryIndex({
      indexName: "gs1",
      partitionKey: { name: "personId", type: AttributeType.STRING },
      sortKey: { name: "coachId", type: AttributeType.STRING },
      readCapacity: 1,
      writeCapacity: 1,
    });

    const writeFunction = new NodejsFunction(
      this,
      "WriteCoachAthleteFn",
      {
        architecture: Architecture.ARM_64,
        entry:`${__dirname}/dynamo-fns/CoachAthlete/write-coach-athlete.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      }
    );

    coachAthleteTable.grantWriteData(writeFunction);

    //we have to manually allow the read function to access the global seconday index
    writeFunction.addToRolePolicy(
      new PolicyStatement({
        resources: [
          `${coachAthleteTable.tableArn}/index/*`,
          coachAthleteTable.tableArn,
        ],
        actions: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:Get*",
          "dynamodb:BatchGet*",
          "dynamodb:DescribeTable",
        ],
      })
    );

    const api = new HttpApi(this, "CoachAthleteApi", {
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.DELETE,
        ],
        allowOrigins: props.apiCorsAllowedOrigins,
      },
    });

    const writeIntegration = new HttpLambdaIntegration(
      "WriteIntegration",
      writeFunction
    );

    api.addRoutes({
      integration: writeIntegration,
      methods: [HttpMethod.POST],
      path: "/coachathletes",
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}
