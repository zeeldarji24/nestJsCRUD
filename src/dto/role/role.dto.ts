import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    permission: string[];
}

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsArray()
    @IsOptional()
    permission?: string[];
}

export class GetRoleByIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}