import { IsString, IsEmail, MinLength } from 'class-validator';

export class UserDTO {
  @IsString()
  readonly displayName: string;
  @IsString()
  readonly ethAddress: string;
}
