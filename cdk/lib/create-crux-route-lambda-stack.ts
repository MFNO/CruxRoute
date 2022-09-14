import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface CreateGatewayAndLambdaStackProps extends StackProps {
  readonly deploymentEnvironment: "dev" | "prod";
  readonly userPool: UserPool;
  readonly userPoolClient: UserPoolClient;
  readonly apiCorsAllowedOrigins: string[];
}

export class CreateGatewayAndLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloFn = new NodejsFunction(this, "HelloWorldFn", {
      runtime: Runtime.NODEJS_14_X,
      //architecture: Architecture.ARM_64,
      logRetention: RetentionDays.ONE_WEEK,
      entry: `${__dirname}/../lambda/hello-world/index.ts`,
      handler: "handler",
      memorySize: 1024,
      timeout: Duration.seconds(15),
      bundling: {
        minify: true,
        externalModules: [
          "aws-sdk",
          "uuid",
          "chrome-aws-lambda",
          "puppeteer-core",
        ],
        // tsconfig: `${__dirname}/../lambda/hello-world/tsconfig.json` // override defaults tsconfig
      },
      layers: [uuidLayer, chromeLayer],
      tracing: Tracing.ACTIVE,
    });

    const api = new HttpApi(this, `${this.stackName}-Api`, {
      corsPreflight: {
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: props.apiCorsAllowedOrigins,
      },
    });

    const authorizer = new HttpUserPoolAuthorizer(
      "Authorizer",
      props.userPool,
      {
        userPoolClients: [props.userPoolClient],
        identitySource: ["$request.header.Authorization"],
      }
    );

    const helloReadIntegration = new HttpLambdaIntegration(
      "ReadIntegration",
      helloFn
    );
    const simpleReadIntegration = new HttpLambdaIntegration(
      "SimpleReadIntegration",
      simpleFn
    );

    api.addRoutes({
      integration: helloReadIntegration,
      methods: [HttpMethod.GET],
      path: "/notes",
    });

    api.addRoutes({
      integration: simpleReadIntegration,
      methods: [HttpMethod.GET],
      path: "/simple",
      authorizer,
    });

    new CfnOutput(this, "HttpApiUrl", { value: api.apiEndpoint });
  }
}
