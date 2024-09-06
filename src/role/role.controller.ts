import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, GetRoleByIdDto } from 'src/dto/role/role.dto';
import { Prisma, Role } from '@prisma/client';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto): Promise<{ message: string; data?: Role }> {
        const role = await this.roleService.createRole(createRoleDto);
        return { message: 'Role created successfully', data: role };
    }

    @Get()
    async getRoles(): Promise<{ message: string; data?: Role[] }> {
        const roles = await this.roleService.getRoles();
        if (roles.length === 0) {
            return { message: 'No roles found' };
        }
        return { message: 'Roles retrieved successfully', data: roles };
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string): Promise<{ message: string; data?: Role }> {
        const role = await this.roleService.getRoleById({ id });
        if (!role) {
            return { message: 'Role not found' };
        }
        return { message: 'Role retrieved successfully', data: role };
    }

    @Put(':id')
    async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<{ message: string; data?: Role }> {
        const role = await this.roleService.updateRole({ id }, updateRoleDto);
        return { message: 'Role updated successfully', data: role };
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string): Promise<{ message: string; data?: Role }> {
        const role = await this.roleService.deleteRole({ id });
        return { message: 'Role deleted successfully', data: role };
    }
}
