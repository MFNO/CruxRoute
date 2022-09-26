export const environment = {
  production: true,
  CloudFront: {
    applicationURL: 'cruxroute.com',
  },
  CoachAthleteLambdaStack: {
    HttpApiUrl: 'https://zie4qhqgbb.execute-api.us-east-1.amazonaws.com',
  },
  Cognito: {
    userPoolWebClientId: '6fm901qvdtusfea7avmj3vg579',
    userPoolDomain: 'crux-route-users-domain-prefix',
    cognitoOauthUrl:
      'https://crux-route-users-domain-prefix.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=6fm901qvdtusfea7avmj3vg579&redirect_uri=https://cruxroute.com',
    userPoolId: 'us-east-1_BbImq7uQ2',
  },
  TrainingEventLambdaStack: {
    HttpApiUrl: 'https://zkfjmpa6o3.execute-api.us-east-1.amazonaws.com',
  },
};
