import { cognitoUser } from './cognitoUser';

export interface Coach extends cognitoUser {
  linked: boolean;
  email: string;
}
