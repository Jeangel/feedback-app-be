export interface IJwtPayloadDTO {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}
