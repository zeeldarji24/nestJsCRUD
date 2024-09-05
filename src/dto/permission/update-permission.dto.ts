import { IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsString()
  readonly action?: string;
}
