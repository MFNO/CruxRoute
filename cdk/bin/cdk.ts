#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CreateCruxRouteTrainingEventLambdaStack } from "../lib/crux-route-training-event-lambda-stack";
import { CreateCruxRouteCloudfrontStack } from "../lib/crux-route-cloudfront-stack";
import { CreateCruxRouteCognitoStack } from "../lib/crux-route-cognito-stack";
import { CreateCruxRouteCoachAthleteLambdaStack } from "../lib/crux-route-coach-athlete-lambda-stack";

const envCruxRoute = { account: "710911053146", region: "us-east-1" };

const app = new cdk.App();
new CreateCruxRouteCloudfrontStack(app, "prodCloudFront", {
  env: envCruxRoute,
});

const devCognitoStack = new CreateCruxRouteCognitoStack(app, "devCognito", {
  env: envCruxRoute,
  stackName: "devCognito",
  callbackUrls: ["http://localhost:4000/"],
  logoutUrls: [],
});

new CreateCruxRouteTrainingEventLambdaStack(
  app,
  "devTrainingEventLambdaStack",
  {
    userPool: devCognitoStack.userPool,
    userPoolClient: devCognitoStack.userPoolClient,
    env: envCruxRoute,
    stackName: "devTrainingEventLambdaStack",
    apiCorsAllowedOrigins: ["http://localhost:4200"],
  }
);

new CreateCruxRouteCoachAthleteLambdaStack(app, "devCoachAthleteLambdaStack", {
  userPool: devCognitoStack.userPool,
  userPoolClient: devCognitoStack.userPoolClient,
  env: envCruxRoute,
  stackName: "devCoachAthleteLambdaStack",
  apiCorsAllowedOrigins: ["http://localhost:4200"],
});

const prodCognitoStack = new CreateCruxRouteCognitoStack(app, "prodCognito", {
  env: envCruxRoute,
  stackName: "prodCognito",
  callbackUrls: ["https://cruxroute.com"],
  logoutUrls: [],
});

new CreateCruxRouteTrainingEventLambdaStack(
  app,
  "prodTrainingEventLambdaStack",
  {
    userPool: prodCognitoStack.userPool,
    userPoolClient: prodCognitoStack.userPoolClient,
    env: envCruxRoute,
    stackName: "prodTrainingEventLambdaStack",
    apiCorsAllowedOrigins: ["https://cruxroute.com"],
  }
);

new CreateCruxRouteCoachAthleteLambdaStack(app, "prodCoachAthleteLambdaStack", {
  userPool: prodCognitoStack.userPool,
  userPoolClient: prodCognitoStack.userPoolClient,
  env: envCruxRoute,
  stackName: "prodCoachAthleteLambdaStack",
  apiCorsAllowedOrigins: ["https://cruxroute.com"],
});
