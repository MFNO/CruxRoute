import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { RemovalPolicy, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

interface CreateCruxRouteLambdaStackProps extends StackProps {
  readonly deploymentEnvironment: "dev" | "prod";
  readonly apiCorsAllowedOrigins: string[];
}

export class CreateCruxRouteLambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CreateCruxRouteLambdaStackProps
  ) {
    super(scope, id, props);

    const table = new Table(this, id, {
      billingMode: BillingMode.PROVISIONED,
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: "date", type: AttributeType.STRING },
      tableName: "EventTable",
    });

    const readFunction = new NodejsFunction(this, "ReadEventFn", {
      architecture: Architecture.ARM_64,
      entry: `${__dirname}/dynamo-fns/read-event.ts`,
      logRetention: RetentionDays.ONE_WEEK,
    });

    const writeFunction = new NodejsFunction(this, "WriteEventFn", {
      architecture: Architecture.ARM_64,
      entry: `${__dirname}/dynamo-fns/write-event.ts`,
      logRetention: RetentionDays.ONE_WEEK,
    });

    table.grantReadData(readFunction);

    table.grantWriteData(writeFunction);

    const api = new HttpApi(this, `EventApi`, {
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: props.apiCorsAllowedOrigins,
      },
    });

    const readIntegration = new HttpLambdaIntegration(
      "ReadIntegration",
      readFunction
    );

    const writeIntegration = new HttpLambdaIntegration(
      "WriteIntegration",
      writeFunction
    );

    api.addRoutes({
      integration: readIntegration,
      methods: [HttpMethod.GET],
      path: "/events",
    });

    api.addRoutes({
      integration: writeIntegration,
      methods: [HttpMethod.POST],
      path: "/events",
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}