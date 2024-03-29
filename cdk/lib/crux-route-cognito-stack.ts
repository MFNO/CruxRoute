import { RemovalPolicy, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  BooleanAttribute,
  ClientAttributes,
  StringAttribute,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface CreateCruxRouteCognitoStackProps extends StackProps {
  readonly callbackUrls: string[];
  readonly logoutUrls: string[];
  readonly cruxRouteEnv: "dev" | "prod";
}

export class CreateCruxRouteCognitoStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;
  public readonly userPoolArn: string;

  constructor(
    scope: Construct,
    id: string,
    props: CreateCruxRouteCognitoStackProps
  ) {
    super(scope, id, props);

    this.userPool = new UserPool(this, "CruxRouteUserPool", {
      userPoolName: "CruxRouteUserPool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      customAttributes: {
        cruxRouteRole: new StringAttribute({ mutable: true }),
      },
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.userPoolArn = this.userPool.userPoolArn;

    const uniquePrefix = `${props.cruxRouteEnv}-crux-route-users-domain-prefix`;
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

    const clientReadAttributes = new ClientAttributes()
      .withStandardAttributes(standardCognitoAttributes)
      .withCustomAttributes(...["cruxRouteRole"]);

    const clientWriteAttributes = new ClientAttributes()
      .withStandardAttributes({
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false,
      })
      .withCustomAttributes(...["cruxRouteRole"]);

    this.userPoolClient = new UserPoolClient(this, "CruxRouteUserPoolClient", {
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
    });

    new CfnOutput(this, "userPoolId", {
      value: this.userPool.userPoolId,
    });

    new CfnOutput(this, "userPoolWebClientId", {
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
