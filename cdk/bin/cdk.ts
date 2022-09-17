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

new CreateCruxRouteCognitoStack(app, "CreateDevCruxRouteCognito", {
  deploymentEnvironment: "dev",
  stackName: "DevCruxRouteCognito",
  callbackUrls: ["http://localhost:4000/"],
  logoutUrls: [],
});

new CreateCruxRouteLambdaStack(app, "CreateCruxRouteLambdaStack", {
  env: envCruxRoute,
  deploymentEnvironment: "dev",
  stackName: "CruxRouteLambdaStack",
  apiCorsAllowedOrigins: [
    "http://localhost:4200",
    "http://cruxroutebucket.s3-website-us-east-1.amazonaws.com",
  ],
});
