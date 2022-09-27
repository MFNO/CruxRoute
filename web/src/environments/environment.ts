// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Cognito: {
    userPoolWebClientId: '11rmkubr1tckh705prkggkmene',
    ExportsOutputRefCruxRouteUserPoolClient7083AE0CB87EA1D1:
      '11rmkubr1tckh705prkggkmene',
    userPoolDomain: 'dev-crux-route-users-domain-prefix',
    cognitoOauthUrl:
      'https://dev-crux-route-users-domain-prefix.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=11rmkubr1tckh705prkggkmene&redirect_uri=http://localhost:4000/',
    ExportsOutputRefCruxRouteUserPoolFF2E6852EB048DDA: 'us-east-1_SoEQPWLlX',
    userPoolId: 'us-east-1_SoEQPWLlX',
    ExportsOutputFnGetAttCruxRouteUserPoolFF2E6852ArnCB12EF4C:
      'arn:aws:cognito-idp:us-east-1:985131702940:userpool/us-east-1_SoEQPWLlX',
  },
  TrainingEventLambdaStack: {
    HttpApiUrl: 'https://efeint2nv2.execute-api.us-east-1.amazonaws.com',
  },
  CoachAthleteLambdaStack: {
    HttpApiUrl: 'https://937edi3spc.execute-api.us-east-1.amazonaws.com',
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
