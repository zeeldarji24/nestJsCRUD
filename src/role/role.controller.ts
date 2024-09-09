import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, GetRoleByIdDto } from 'src/dto/role/role.dto';
import { RoleResponse } from 'src/dto/role/role.dto';

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) { }

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponse> {
        try {
            return await this.roleService.createRole(createRoleDto);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException('Error creating role');
            }
            throw new BadRequestException('Error creating role');
        }
    }

    @Get()
    async getAllRoles(): Promise<RoleResponse> {
        try {
            return await this.roleService.getRoles();
        } catch (error) {
            throw new BadRequestException('Error retrieving roles');
        }
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string): Promise<RoleResponse> {
        try {
            return await this.roleService.getRoleById({ id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Error retrieving role');
        }
    }

    @Put(':id')
    async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponse> {
        try {
            return await this.roleService.updateRole({ id }, updateRoleDto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Error updating role');
        }
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string): Promise<RoleResponse> {
        try {
            return await this.roleService.deleteRole({ id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Error deleting role');
        }
    }
}
