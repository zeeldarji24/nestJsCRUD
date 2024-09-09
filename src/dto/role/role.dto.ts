import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    permissions: string[];
}

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsArray()
    @IsOptional()
    permissions?: string[];
}

export class GetRoleByIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}

export interface RoleResponse {
    message: string;
    data: {
        id: string;
        name: string;
        isDeleted: boolean;
        permissions: { id: string; action: string }[];
    }[];
}
