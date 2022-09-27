export interface Attribute {
  Name: string;
  Value: string;
}

export interface cognitoUser {
  Attributes: Attribute[];
  Enabled: boolean;
  UserCreateDate: Date;
  UserLastModifiedDate: Date;
  UserStatus: string;
  Username: string;
}
