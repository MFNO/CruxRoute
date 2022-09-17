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
  "DevCreateCruxRouteCognito",
  {
    env: envCruxRoute,
    deploymentEnvironment: "dev",
    stackName: "DevCruxRouteCognito",
    callbackUrls: ["http://localhost:4000/"],
    logoutUrls: [],
  }
);

new CreateCruxRouteLambdaStack(app, "DevCreateCruxRouteLambdaStack", {
  userPool: devCognitoStack.userPool,
  userPoolClient: devCognitoStack.userPoolClient,
  env: envCruxRoute,
  deploymentEnvironment: "dev",
  stackName: "DevCruxRouteLambdaStack",
  apiCorsAllowedOrigins: [
    "http://localhost:4200",
    "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
  ],
});

const prodCognitoStack = new CreateCruxRouteCognitoStack(
  app,
  "ProdCreateCruxRouteCognito",
  {
    env: envCruxRoute,
    deploymentEnvironment: "prod",
    stackName: "ProdCruxRouteCognito",
    callbackUrls: ["http://cruxroutebucket.s3-website-us-east-1.amazonaws.com"],
    logoutUrls: [],
  }
);

new CreateCruxRouteLambdaStack(app, "ProdCreateCruxRouteLambdaStack", {
  userPool: prodCognitoStack.userPool,
  userPoolClient: prodCognitoStack.userPoolClient,
  env: envCruxRoute,
  deploymentEnvironment: "prod",
  stackName: "ProdCruxRouteLambdaStack",
  apiCorsAllowedOrigins: [
    "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
  ],
});
