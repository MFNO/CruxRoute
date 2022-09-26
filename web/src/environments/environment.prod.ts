export const environment = {
  production: true,
  prodCloudFront: {
    applicationURL: 'cruxroute.com',
  },
  CoachAthleteLambdaStack: {
    HttpApiUrl: 'https://dfg9zrqjbh.execute-api.us-east-1.amazonaws.com',
  },
  Cognito: {
    userPoolWebClientId: '1pc1u753ih5k5d3266m1icdqaa',
    userPoolDomain: 'prod-crux-route',
    cognitoOauthUrl:
      'https://prod-crux-route.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=1pc1u753ih5k5d3266m1icdqaa&redirect_uri=https://cruxroute.com',
    userPoolId: 'us-east-1_xGBlhpVob',
  },
  TrainingEventLambdaStack: {
    HttpApiUrl: 'https://v8bxjh5y69.execute-api.us-east-1.amazonaws.com',
  },
};
