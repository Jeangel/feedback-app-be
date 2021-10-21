export interface JwtPayloadDTO {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}
