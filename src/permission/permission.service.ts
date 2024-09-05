import { Injectable } from '@nestjs/common';
import { Permission, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto } from 'src/dto/permission/create-permission.dto';
import { UpdatePermissionDto } from 'src/dto/permission/update-permission.dto';

@Injectable()
export class PermissionService {
    constructor(private readonly prisma: PrismaService) { }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.prisma.permission.create({
            data: createPermissionDto,
        });
    }

    async getPermissions(): Promise<Permission[]> {
        return this.prisma.permission.findMany();
    }

    async getPermissionById(permissionWhereUniqueInput: Prisma.PermissionWhereUniqueInput): Promise<Permission | null> {
        return this.prisma.permission.findUnique({
            where: permissionWhereUniqueInput,
        });
    }

    async updatePermission(permissionWhereUniqueInput: Prisma.PermissionWhereUniqueInput, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        return this.prisma.permission.update({
            where: permissionWhereUniqueInput,
            data: updatePermissionDto,
        });
    }

    async deletePermission(permissionWhereUniqueInput: Prisma.PermissionWhereUniqueInput): Promise<Permission> {
        return this.prisma.permission.delete({
            where: permissionWhereUniqueInput,
        });
    }
}
