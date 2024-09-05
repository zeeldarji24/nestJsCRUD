import { IsString, IsEmail, IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateEmployeeDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsInt()
    @IsOptional()
    age?: number;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsNumber()
    @IsOptional()
    salary?: number;

    @IsString()
    @IsOptional()
    organizationId?: string;

    @IsString()
    @IsOptional()
    roleId: string;

    @IsString()
    @IsOptional()
    password?: string;
}
