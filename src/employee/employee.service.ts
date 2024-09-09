import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertPassword } from 'src/common/common';
import { CreateEmployeeDto } from 'src/dto/employeeDto/create-employee.dto';

@Injectable()
export class EmployeeService {
    constructor(private prisma: PrismaService) { }

    async createEmployee(employeeData: CreateEmployeeDto): Promise<Employee> {
        try {
            const existingEmployee = await this.prisma.employee.findUnique({
                where: { email: employeeData.email },
            });
            if (existingEmployee) {
                throw new ConflictException('Email already exists');
            }

            const createdEmployee = await this.prisma.employee.create({
                data: {
                    name: employeeData.name,
                    email: employeeData.email,
                    age: employeeData.age,
                    gender: employeeData.gender,
                    salary: employeeData.salary,
                    organizationId: employeeData.organizationId,
                    roleId: employeeData.roleId,
                },
            });
            const password = await convertPassword(employeeData.password);
            await this.prisma.userCredential.create({
                data: {
                    empId: createdEmployee.id,
                    password: password,
                },
            });

            return createdEmployee;
        } catch (error) {
            throw error;
        }
    }

    async getAllEmployees(): Promise<Employee[]> {
        return this.prisma.employee.findMany({
            where: { isDeleted: false },
            include: {
                organization: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        permissions: true,
                    },
                },
            },
        });
    }

    async getEmployeeById(employeeWhereUniqueInput: Prisma.EmployeeWhereUniqueInput): Promise<Employee | null> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                ...employeeWhereUniqueInput,
                isDeleted: false
            },
            include: {
                organization: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        permissions: true,
                    },
                },
            },
        });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        return employee;
    }

    async updateEmployee(
        employeeWhereUniqueInput: Prisma.EmployeeWhereUniqueInput,
        employeeData: Prisma.EmployeeUpdateInput
    ): Promise<Employee | null> {
        try {
            return await this.prisma.employee.update({
                where: employeeWhereUniqueInput,
                data: employeeData,
            });
        } catch (error) {
            throw new NotFoundException('Employee not found');
        }
    }

    async deleteEmployee(
        employeeWhereUniqueInput: Prisma.EmployeeWhereUniqueInput
    ): Promise<{ message: string }> {
        try {
            await this.prisma.employee.update({
                where: employeeWhereUniqueInput,
                data: { isDeleted: true },
            });

            await this.prisma.userCredential.updateMany({
                where: { empId: employeeWhereUniqueInput.id },
                data: { isDeleted: true },
            });

            return { message: 'Employee and associated user credentials marked as deleted successfully' };
        } catch (error) {
            throw new NotFoundException('Employee not found or error occurred');
        }
    }
}
