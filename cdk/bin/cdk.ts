#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CreateCruxRouteTrainingEventLambdaStack } from "../lib/crux-route-training-event-lambda-stack";
import {} from "../lib/crux-route-cloudfront-stack";
import { CreateCruxRouteCognitoStack } from "../lib/crux-route-cognito-stack";
import { CreateCruxRouteCoachAthleteLambdaStack } from "../lib/crux-route-coach-athlete-lambda-stack";

const envCruxRoute = { account: "710911053146", region: "us-east-1" };

const app = new cdk.App();
// new DeployAppToS3AndCloudfrontStack(app, "DeployAppToS3AndCloudfrontStack", {
//   env: envCruxRoute,
// });

const devCognitoStack = new CreateCruxRouteCognitoStack(
  app,
  "dev-CreateCruxRouteCognito",
  {
    env: envCruxRoute,
    deploymentEnvironment: "dev",
    stackName: "dev-CruxRouteCognito",
    callbackUrls: ["http://localhost:4000/"],
    logoutUrls: [],
  }
);

new CreateCruxRouteTrainingEventLambdaStack(
  app,
  "dev-CreateCruxRouteTrainingEventLambdaStack",
  {
    userPool: devCognitoStack.userPool,
    userPoolClient: devCognitoStack.userPoolClient,
    env: envCruxRoute,
    deploymentEnvironment: "dev",
    stackName: "dev-CruxRouteTrainingEventLambdaStack",
    apiCorsAllowedOrigins: [
      "http://localhost:4200",
      "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
    ],
  }
);

new CreateCruxRouteCoachAthleteLambdaStack(
  app,
  "dev-CreateCruxRouteCoachAthleteLambdaStack",
  {
    userPool: devCognitoStack.userPool,
    userPoolClient: devCognitoStack.userPoolClient,
    env: envCruxRoute,
    deploymentEnvironment: "dev",
    stackName: "dev-CruxRouteCoachAthleteLambdaStack",
    apiCorsAllowedOrigins: [
      "http://localhost:4200",
      "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
    ],
  }
);

const prodCognitoStack = new CreateCruxRouteCognitoStack(
  app,
  "prod-CreateCruxRouteCognito",
  {
    env: envCruxRoute,
    deploymentEnvironment: "prod",
    stackName: "prod-CruxRouteCognito",
    callbackUrls: ["http://cruxroutebucket.s3-website-us-east-1.amazonaws.com"],
    logoutUrls: [],
  }
);

new CreateCruxRouteTrainingEventLambdaStack(
  app,
  "prod-CreateCruxRouteTrainingEventLambdaStack",
  {
    userPool: prodCognitoStack.userPool,
    userPoolClient: prodCognitoStack.userPoolClient,
    env: envCruxRoute,
    deploymentEnvironment: "prod",
    stackName: "prod-CruxRouteTrainingEventLambdaStack",
    apiCorsAllowedOrigins: [
      "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
    ],
  }
);

new CreateCruxRouteCoachAthleteLambdaStack(
  app,
  "prod-CreateCruxRouteCoachAthleteLambdaStack",
  {
    userPool: prodCognitoStack.userPool,
    userPoolClient: prodCognitoStack.userPoolClient,
    env: envCruxRoute,
    deploymentEnvironment: "prod",
    stackName: "prod-CruxRouteCoachAthleteLambdaStack",
    apiCorsAllowedOrigins: [
      "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
    ],
  }
);
