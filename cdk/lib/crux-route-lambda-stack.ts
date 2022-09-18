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
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

interface CreateCruxRouteLambdaStackProps extends StackProps {
  readonly deploymentEnvironment: "dev" | "prod";
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;
  readonly apiCorsAllowedOrigins: string[];
}

export class CreateCruxRouteLambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CreateCruxRouteLambdaStackProps
  ) {
    super(scope, id, props);

    const { deploymentEnvironment } = props;

    const table = new Table(this, id, {
      billingMode: BillingMode.PROVISIONED,
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: "personId", type: AttributeType.STRING },
      tableName: `${deploymentEnvironment}-TrainingEventTable`,
    });

    table.addGlobalSecondaryIndex({
      indexName: "gs1",
      partitionKey: { name: "personId", type: AttributeType.STRING },
      sortKey: { name: "id", type: AttributeType.STRING },
      readCapacity: 1,
      writeCapacity: 1,
    });

    const deleteFunction = new NodejsFunction(
      this,
      `${deploymentEnvironment}-DeleteEventFn`,
      {
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/dynamo-fns/delete-training-event.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      }
    );

    const readFunction = new NodejsFunction(
      this,
      `${deploymentEnvironment}-ReadEventFn`,
      {
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/dynamo-fns/read-training-event.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      }
    );

    const writeFunction = new NodejsFunction(
      this,
      `${deploymentEnvironment}-WriteEventFn`,
      {
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/dynamo-fns/write-training-event.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      }
    );

    table.grantReadData(readFunction);

    //we have to manually allow the read function to access the global seconday index
    readFunction.addToRolePolicy(
      new PolicyStatement({
        resources: [`${table.tableArn}/index/*`, table.tableArn],
        actions: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:Get*",
          "dynamodb:BatchGet*",
          "dynamodb:DescribeTable",
        ],
      })
    );

    table.grantReadWriteData(deleteFunction);

    table.grantWriteData(writeFunction);

    const api = new HttpApi(this, `${deploymentEnvironment}-TrainingEventApi`, {
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

    const deleteIntegration = new HttpLambdaIntegration(
      "DeleteIntegration",
      deleteFunction
    );

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
      path: "/events/{personId}",
    });

    api.addRoutes({
      integration: writeIntegration,
      methods: [HttpMethod.POST],
      path: "/events",
    });

    api.addRoutes({
      integration: deleteIntegration,
      methods: [HttpMethod.DELETE],
      path: "/events/{personId}/{eventId}",
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}
