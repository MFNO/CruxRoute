#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DeployAppToS3AndCloudfrontStack } from "../lib/deploy-to-s3-and-cloudfront-stack";

const envCruxRoute = { account: "710911053146", region: "us-east-1" };

const app = new cdk.App();
new DeployAppToS3AndCloudfrontStack(app, "DeployAppToS3AndCloudfrontStack", {
  env: envCruxRoute,
});
