import {
  Stack,
  StackProps,
  RemovalPolicy,
  CfnOutput,
  aws_lambda_destinations,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, RecordTarget, HostedZone } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import {
  OriginAccessIdentity,
  AllowedMethods,
  ViewerProtocolPolicy,
  Distribution,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpsRedirect } from "aws-cdk-lib/aws-route53-patterns";

export class CreateCruxRouteCloudfrontStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Lookup the zone based on domain name
    const zone = HostedZone.fromLookup(this, "baseZone", {
      domainName: "cruxroute.com",
    });

    // SSL certificate
    const certificateArn = Certificate.fromCertificateArn(
      this,
      "tlsCertificate",
      "arn:aws:acm:us-east-1:141792826791:certificate/b7c783cd-5c99-4d9a-b7d3-8f5b63269eca"
    );

    // Web hosting bucket
    const websiteBucket = new Bucket(this, "cruxRouteBucket", {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Trigger frontend deployment
    new BucketDeployment(this, "websiteDeployment", {
      sources: [Source.asset("../web/build")],
      destinationBucket: websiteBucket as any,
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "cloudfrontOAI",
      {
        comment: "OAI for web application cloudfront distribution",
      }
    );

    // Creating CloudFront distribution
    const cloudFrontDist = new Distribution(this, "cloudfrontDist", {
      defaultRootObject: "index.html",
      domainNames: ["cruxroute.com"],
      certificate: certificateArn,
      defaultBehavior: {
        origin: new S3Origin(websiteBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    const applicationURL = new ARecord(this, "appURL", {
      zone: zone,
      recordName: "cruxroute.com",
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDist)),
    });

    // Output the application URL to test connection
    new CfnOutput(this, "applicationURL", {
      value: applicationURL.domainName,
      exportName: "applicationURL",
    });

    new HttpsRedirect(this, "wwwToNonWww", {
      recordNames: ["www.cruxroute.com"],
      targetDomain: "cruxroute.com",
      zone: zone,
    });
  }
}
