import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  action: string;
}