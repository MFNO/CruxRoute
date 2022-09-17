import { RemovalPolicy, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  ClientAttributes,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface CreateCruxRouteCognitoStackProps extends StackProps {
  readonly deploymentEnvironment: "dev" | "prod";
  readonly callbackUrls: string[];
  readonly logoutUrls: string[];
}

export class CreateCruxRouteCognitoStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(
    scope: Construct,
    id: string,
    props: CreateCruxRouteCognitoStackProps
  ) {
    super(scope, id, props);

    const { deploymentEnvironment } = props;

    this.userPool = new UserPool(
      this,
      `${deploymentEnvironment}-CruxRouteUserPool`,
      {
        userPoolName: `${deploymentEnvironment}-CruxRouteUserPool`,
        selfSignUpEnabled: true,
        signInAliases: {
          email: true,
        },
        autoVerify: {
          email: true,
        },
        removalPolicy: RemovalPolicy.RETAIN,
      }
    );

    const uniquePrefix = `${deploymentEnvironment}-crux-route`;
    const userPoolDomain = this.userPool.addDomain("default", {
      cognitoDomain: {
        domainPrefix: uniquePrefix,
      },
    });

    const standardCognitoAttributes = {
      givenName: true,
      familyName: true,
      email: true,
      emailVerified: true,
      address: true,
      birthdate: true,
      gender: true,
      locale: true,
      middleName: true,
      fullname: true,
      nickname: true,
      phoneNumber: true,
      phoneNumberVerified: true,
      profilePicture: true,
      preferredUsername: true,
      profilePage: true,
      timezone: true,
      lastUpdateTime: true,
      website: true,
    };

    const clientReadAttributes = new ClientAttributes().withStandardAttributes(
      standardCognitoAttributes
    );

    const clientWriteAttributes = new ClientAttributes().withStandardAttributes(
      {
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false,
      }
    );

    this.userPoolClient = new UserPoolClient(
      this,
      `${deploymentEnvironment}-CruxRouteUserPoolClient`,
      {
        userPool: this.userPool,
        authFlows: {
          adminUserPassword: true,
          custom: true,
          userSrp: true,
        },
        supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
        readAttributes: clientReadAttributes,
        writeAttributes: clientWriteAttributes,
        oAuth: {
          callbackUrls: props.callbackUrls,
          logoutUrls: props.logoutUrls,
        },
      }
    );

    new CfnOutput(this, "userPoolId", {
      value: this.userPool.userPoolId,
    });

    new CfnOutput(this, "userPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });

    new CfnOutput(this, "userPoolDomain", {
      value: userPoolDomain.domainName,
    });

    new CfnOutput(this, "cognitoOauthUrl", {
      value:
        `https://${userPoolDomain.domainName}.auth.us-east-1.amazoncognito.com/oauth2/authorize?` +
        `response_type=token&client_id=${this.userPoolClient.userPoolClientId}&redirect_uri=${props.callbackUrls[0]}`,
    });
  }
}
