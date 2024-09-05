import { IsString, IsEmail, IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsInt()
    @IsNotEmpty()
    age: number;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsNumber()
    @IsNotEmpty()
    salary: number;

    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @IsString()
    @IsNotEmpty()
    roleId: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
