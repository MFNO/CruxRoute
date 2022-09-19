#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CreateCruxRouteLambdaStack } from "../lib/crux-route-lambda-stack";
import {} from "../lib/crux-route-cloudfront-stack";
import { CreateCruxRouteCognitoStack } from "../lib/crux-route-cognito-stack";

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

new CreateCruxRouteLambdaStack(app, "dev-CreateCruxRouteLambdaStack", {
  userPool: devCognitoStack.userPool,
  userPoolClient: devCognitoStack.userPoolClient,
  env: envCruxRoute,
  deploymentEnvironment: "dev",
  stackName: "dev-CruxRouteLambdaStack",
  apiCorsAllowedOrigins: [
    "http://localhost:4200",
    "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
  ],
});

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

new CreateCruxRouteLambdaStack(app, "prod-CreateCruxRouteLambdaStack", {
  userPool: prodCognitoStack.userPool,
  userPoolClient: prodCognitoStack.userPoolClient,
  env: envCruxRoute,
  deploymentEnvironment: "prod",
  stackName: "prod-CruxRouteLambdaStack",
  apiCorsAllowedOrigins: [
    "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
  ],
});
