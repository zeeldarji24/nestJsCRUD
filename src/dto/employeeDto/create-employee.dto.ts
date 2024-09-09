import { IsString, IsEmail, IsInt, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({
        description: 'Name of the employee',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Email address of the employee',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Age of the employee',
        example: 30,
    })
    @IsInt()
    @IsNotEmpty()
    age: number;

    @ApiProperty({
        description: 'Gender of the employee',
        example: 'Male',
    })
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({
        description: 'Salary of the employee',
        example: 50000,
    })
    @IsNumber()
    @IsNotEmpty()
    salary: number;

    @ApiProperty({
        description: 'Organization ID that the employee belongs to',
        example: 'org12345',
    })
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty({
        description: 'Role ID assigned to the employee',
        example: 'role12345',
    })
    @IsString()
    @IsNotEmpty()
    roleId: string;

    @ApiProperty({
        description: 'Password for the employee account',
        example: 'StrongP@ssword!',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
