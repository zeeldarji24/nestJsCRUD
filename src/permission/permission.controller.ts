import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Delete,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from 'src/dto/permission/create-permission.dto';
import { UpdatePermissionDto } from 'src/dto/permission/update-permission.dto';
import { Permission } from '@prisma/client';

@Controller('permissions')
export class PermissionController {
    constructor(private permissionService: PermissionService) { }

    @Post()
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
        try {
            return await this.permissionService.createPermission(createPermissionDto);
        } catch (error) {
            throw new BadRequestException('Failed to create permission');
        }
    }

    @Get()
    async findAll(): Promise<Permission[]> {
        return this.permissionService.getPermissions();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Permission> {
        const permission = await this.permissionService.getPermissionById({ id });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return permission;
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto
    ): Promise<Permission> {
        const permission = await this.permissionService.getPermissionById({ id });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        try {
            return await this.permissionService.updatePermission({ id }, updatePermissionDto);
        } catch (error) {
            throw new BadRequestException('Failed to update permission');
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Permission> {
        const permission = await this.permissionService.getPermissionById({ id });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        return this.permissionService.deletePermission({ id });
    }
}
