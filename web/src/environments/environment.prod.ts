export const environment = {
  production: true,
  CloudFront: {
    applicationURL: 'cruxroute.com',
  },
  Cognito: {
    userPoolWebClientId: '5jbqgcrugjo4d7pd48ro9q78jt',
    ExportsOutputRefCruxRouteUserPoolClient7083AE0CB87EA1D1:
      '5jbqgcrugjo4d7pd48ro9q78jt',
    userPoolDomain: 'prod-crux-route-users-domain-prefix',
    cognitoOauthUrl:
      'https://prod-crux-route-users-domain-prefix.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=5jbqgcrugjo4d7pd48ro9q78jt&redirect_uri=https://cruxroute.com',
    ExportsOutputRefCruxRouteUserPoolFF2E6852EB048DDA: 'us-east-1_89bYEvWes',
    userPoolId: 'us-east-1_89bYEvWes',
    ExportsOutputFnGetAttCruxRouteUserPoolFF2E6852ArnCB12EF4C:
      'arn:aws:cognito-idp:us-east-1:141792826791:userpool/us-east-1_89bYEvWes',
  },
  TrainingEventLambdaStack: {
    HttpApiUrl: 'https://65qs6cc827.execute-api.us-east-1.amazonaws.com',
  },
  CoachAthleteLambdaStack: {
    HttpApiUrl: 'https://gbdqo7kgw4.execute-api.us-east-1.amazonaws.com',
  },
};
