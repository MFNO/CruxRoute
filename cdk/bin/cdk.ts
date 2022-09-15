#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CreateCruxRouteLambdaStack } from "../lib/crux-route-lambda-stack";
import {} from "../lib/crux-route-cloudfront-stack";

const envCruxRoute = { account: "710911053146", region: "us-east-1" };

const app = new cdk.App();
// new DeployAppToS3AndCloudfrontStack(app, "DeployAppToS3AndCloudfrontStack", {
//   env: envCruxRoute,
// });

new CreateCruxRouteLambdaStack(app, "CreateCruxRouteLambdaStack", {
  env: envCruxRoute,
  deploymentEnvironment: "dev",
  stackName: "CruxRouteLambdaStack",
  apiCorsAllowedOrigins: ["http://localhost:4200"],
});
