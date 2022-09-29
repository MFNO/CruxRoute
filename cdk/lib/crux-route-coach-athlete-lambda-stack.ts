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
  readonly userPoolArn: string;
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
      sortKey: { name: "athleteId", type: AttributeType.STRING },
      tableName: "CoachAthleteTable",
    });

    coachAthleteTable.addGlobalSecondaryIndex({
      indexName: "gs1",
      partitionKey: { name: "athleteId", type: AttributeType.STRING },
      sortKey: { name: "coachId", type: AttributeType.STRING },
      readCapacity: 1,
      writeCapacity: 1,
    });

    const writeFunction = new NodejsFunction(this, "WriteCoachAthleteFn", {
      environment: {
        userPoolId: props.userPool.userPoolId,
        userPoolClientId: props.userPoolClient.userPoolClientId,
      },
      architecture: Architecture.ARM_64,
      entry: `${__dirname}/dynamo-fns/CoachAthlete/write-coach-athlete.ts`,
      logRetention: RetentionDays.ONE_WEEK,
    });

    const readCoachByAthleteFunction = new NodejsFunction(
      this,
      "ReadCoachByAthleteFn",
      {
        environment: {
          userPoolId: props.userPool.userPoolId,
          userPoolClientId: props.userPoolClient.userPoolClientId,
        },
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/dynamo-fns/CoachAthlete/read-coach-by-athlete.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      }
    );

    const readAthletesByCoachFunction = new NodejsFunction(
      this,
      "ReadAthletesByCoachFn",
      {
        environment: {
          userPoolId: props.userPool.userPoolId,
          userPoolClientId: props.userPoolClient.userPoolClientId,
        },
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/dynamo-fns/CoachAthlete/read-athletes-by-coach.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      }
    );

    coachAthleteTable.grantWriteData(writeFunction);
    coachAthleteTable.grantReadData(readCoachByAthleteFunction);
    coachAthleteTable.grantReadData(readAthletesByCoachFunction);

    //we have to manually allow the read function to access the global seconday index
    writeFunction.addToRolePolicy(
      new PolicyStatement({
        resources: [
          `${coachAthleteTable.tableArn}/index/*`,
          coachAthleteTable.tableArn,
        ],
        actions: ["dynamodb:PutItem"],
      })
    );

    //add permissions to allow function to access cognito
    writeFunction.addToRolePolicy(
      new PolicyStatement({
        resources: [`${props.userPoolArn}/*`, props.userPoolArn],
        actions: ["cognito-idp:ListUsers"],
      })
    );

    //we have to manually allow the read function to access the global seconday index
    readCoachByAthleteFunction.addToRolePolicy(
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

    //add permissions to allow function to access cognito
    readCoachByAthleteFunction.addToRolePolicy(
      new PolicyStatement({
        resources: [`${props.userPoolArn}/*`, props.userPoolArn],
        actions: ["cognito-idp:ListUsers"],
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

    const readCoachByAthleteIntegration = new HttpLambdaIntegration(
      "ReadCoachByAthleteIntegration",
      readCoachByAthleteFunction
    );

    const readAthletesByCoachIntegration = new HttpLambdaIntegration(
      "ReadAthletesByCoachIntegration",
      readAthletesByCoachFunction
    );

    api.addRoutes({
      integration: writeIntegration,
      methods: [HttpMethod.POST],
      path: "/coachathletes",
    });

    api.addRoutes({
      integration: readCoachByAthleteIntegration,
      methods: [HttpMethod.GET],
      path: "/coachathletes/{athleteId}/coach",
    });

    api.addRoutes({
      integration: readAthletesByCoachIntegration,
      methods: [HttpMethod.GET],
      path: "/coachathletes/{coachId}/athletes",
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}
