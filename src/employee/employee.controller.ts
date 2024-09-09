import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from 'src/dto/employeeDto/create-employee.dto';
import { UpdateEmployeeDto } from 'src/dto/employeeDto/update-epmployee.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new employee' })
    @ApiBody({ type: CreateEmployeeDto })
    @ApiResponse({ status: 201, description: 'Employee created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: 'Conflict: Employee already exists' })
    async createEmployee(@Body() employeeData: CreateEmployeeDto): Promise<{ message: string; data?: Employee }> {
        try {
            const employee = await this.employeeService.createEmployee(employeeData);
            return { message: 'Employee created successfully', data: employee };

            //return this.employeeService.createEmployee(employeeData);
            
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException('Employee with this email already exists');
            }
            throw new BadRequestException('Error creating employee');
        }
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all employees' })
    @ApiResponse({ status: 200, description: 'Employees retrieved successfully' })
    @ApiResponse({ status: 404, description: 'No employees found' })
    async getAllEmployees(): Promise<{ message: string; data?: Employee[] }> {
        const employees = await this.employeeService.getAllEmployees();
        if (employees.length === 0) {
            return { message: 'No employees found' };
        }
        return { message: 'Employees retrieved successfully', data: employees };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve an employee by ID' }) 
    @ApiParam({ name: 'id', description: 'Employee ID', type: String }) 
    @ApiResponse({ status: 200, description: 'Employee retrieved successfully'}) 
    @ApiResponse({ status: 404, description: 'Employee not found' }) 
    @ApiResponse({ status: 400, description: 'Bad request' }) 
    async getEmployeeById(@Param('id') id: string): Promise<{ message: string; data?: Employee }> {
        try {
            const employee = await this.employeeService.getEmployeeById({ id });
            if (!employee) {
                throw new NotFoundException('Employee not found');
            }
            return { message: 'Employee retrieved successfully', data: employee };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Error retrieving employee');
        }
    }

    @Put(':id')
    async updateEmployee(@Param('id') id: string, @Body() employeeData: UpdateEmployeeDto): Promise<{ message: string; data?: Employee }> {
        try {
            const updatedEmployee = await this.employeeService.updateEmployee({ id }, employeeData);
            if (!updatedEmployee) {
                throw new NotFoundException('Employee not found');
            }
            return { message: 'Employee updated successfully', data: updatedEmployee };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Error updating employee');
        }
    }

    @Delete(':id')
    async deleteEmployee(@Param('id') id: string): Promise<{ message: string }> {
        try {
            const result = await this.employeeService.deleteEmployee({ id });
            return { message: result.message };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Error deleting employee');
        }
    }

}
