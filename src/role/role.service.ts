import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, GetRoleByIdDto, RoleResponse } from 'src/dto/role/role.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) { }

    async createRole(createRoleDto: CreateRoleDto): Promise<RoleResponse> {
        const { permissions, name } = createRoleDto;

        const existingRole = await this.prisma.role.findUnique({
            where: { name },
        });

        if (existingRole) {
            throw new BadRequestException(`Role with the name '${name}' already exists.`);
        }

        const createdRole = await this.prisma.role.create({
            data: {
                name,
                permissions,  
            },
        });

        const permissionDetails = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: createdRole.permissions,
                },
            },
        });

        return {
            message: 'Role created successfully',
            data: [{
                id: createdRole.id,
                name: createdRole.name,
                isDeleted: createdRole.isDeleted,
                permissions: permissionDetails.map(permission => ({
                    id: permission.id,
                    action: permission.action,
                })),
            }],
        };
    }

    async getRoles(): Promise<RoleResponse> {
        const roles = await this.prisma.role.findMany();

        const permissionIds = roles.flatMap(role => role.permissions);
        const uniquePermissionIds = [...new Set(permissionIds)];

        const permissions = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: uniquePermissionIds,
                },
            },
        });

        return {
            message: 'Roles retrieved successfully',
            data: roles.map(role => ({
                id: role.id,
                name: role.name,
                isDeleted: role.isDeleted,
                permissions: permissions.filter(permission => role.permissions.includes(permission.id))
                    .map(permission => ({
                        id: permission.id,
                        action: permission.action,
                    })),
            })),
        };
    }

    async getRoleById(getRoleByIdDto: GetRoleByIdDto): Promise<RoleResponse> {
        const role = await this.prisma.role.findUnique({
            where: getRoleByIdDto,
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        const permissions = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: role.permissions,
                },
            },
        });

        return {
            message: 'Role retrieved successfully',
            data: [{
                id: role.id,
                name: role.name,
                isDeleted: role.isDeleted,
                permissions: permissions.map(permission => ({
                    id: permission.id,
                    action: permission.action,
                })),
            }],
        };
    }

    async updateRole(params: { id: string }, updateRoleDto: UpdateRoleDto): Promise<RoleResponse> {
        const { permissions, name } = updateRoleDto;

        const existingRole = await this.prisma.role.findUnique({
            where: { id: params.id },
        });

        if (!existingRole) {
            throw new NotFoundException('Role not found');
        }

        const updatedRole = await this.prisma.role.update({
            where: { id: params.id },
            data: {
                name,
                permissions,
            },
        });

        const permissionDetails = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: updatedRole.permissions,
                },
            },
        });

        return {
            message: 'Role updated successfully',
            data: [{
                id: updatedRole.id,
                name: updatedRole.name,
                isDeleted: updatedRole.isDeleted,
                permissions: permissionDetails.map(permission => ({
                    id: permission.id,
                    action: permission.action,
                })),
            }],
        };
    }

    async deleteRole(roleWhereUniqueInput: Prisma.RoleWhereUniqueInput): Promise<RoleResponse> {
        const existingRole = await this.prisma.role.findUnique({
            where: roleWhereUniqueInput,
        });

        if (!existingRole) {
            throw new NotFoundException('Role not found');
        }

        const deletedRole = await this.prisma.role.delete({
            where: roleWhereUniqueInput,
        });

        const permissionDetails = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: deletedRole.permissions,
                },
            },
        });

        return {
            message: 'Role deleted successfully',
            data: [{
                id: deletedRole.id,
                name: deletedRole.name,
                isDeleted: deletedRole.isDeleted,
                permissions: permissionDetails.map(permission => ({
                    id: permission.id,
                    action: permission.action,
                })),
            }],
        };
    }
}
