import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from 'src/dto/permission/create-permission.dto';
import { UpdatePermissionDto } from 'src/dto/permission/update-permission.dto';
import { Permission } from '@prisma/client';

@Controller('permissions')
export class PermissionController {
    constructor(private permissionService: PermissionService) { }

    @Post()
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.permissionService.createPermission(createPermissionDto);
    }

    @Get()
    async findAll(): Promise<Permission[]> {
        return this.permissionService.getPermissions();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Permission> {
        return this.permissionService.getPermissionById({ id });
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto
    ): Promise<Permission> {
        return this.permissionService.updatePermission({ id }, updatePermissionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Permission> {
        return this.permissionService.deletePermission({ id });
    }
}
