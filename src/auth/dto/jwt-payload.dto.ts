export interface IJwtPayloadDTO {
  username: string;
  userId: string;
  sub: string;
  iat: number;
  exp: number;
}
