// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  CoachAthleteLambdaStack: {
    HttpApiUrl: 'https://aet71tlq6e.execute-api.us-east-1.amazonaws.com',
  },
  Cognito: {
    userPoolWebClientId: 'lamrnshjrt2i0otmo6jc17ibk',
    userPoolDomain: 'dev-crux-route',
    cognitoOauthUrl:
      'https://dev-crux-route.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=lamrnshjrt2i0otmo6jc17ibk&redirect_uri=http://localhost:4000/',
    userPoolId: 'us-east-1_9MgX7os0X',
  },
  TrainingEventLambdaStack: {
    HttpApiUrl: 'https://n983kob3s9.execute-api.us-east-1.amazonaws.com',
  },
  CloudFront: {
    applicationURL: 'cruxroute.com',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
