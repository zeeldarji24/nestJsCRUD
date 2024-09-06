import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, GetRoleByIdDto } from 'src/dto/role/role.dto';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) { }

    async createRole(createRoleDto: CreateRoleDto) {
        const { permission, name, ...roleData } = createRoleDto;

        const existingRole = await this.prisma.role.findUnique({
            where: { name },
        });

        if (existingRole) {
            throw new Error(`Role with the name '${name}' already exists.`);
        }

        const foundPermissions = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: permission,
                },
            },
        });

        if (foundPermissions.length !== permission.length) {
            throw new Error('One or more permission IDs provided do not exist.');
        }

        return this.prisma.role.create({
            data: {
                ...roleData,
                name,
                permissions: {
                    create: permission.map((permissionId) => ({
                        permission: {
                            connect: { id: permissionId },
                        },
                    })),
                },
            },
            include: {
                permissions: true,
            },
        });
    }

    async getRoles(): Promise<Role[]> {
        const roles = await this.prisma.role.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return roles;
    }

    async getRoleById(getRoleByIdDto: GetRoleByIdDto) {
        return this.prisma.role.findUnique({
            where: getRoleByIdDto,
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    async updateRole(params: { id: string }, updateRoleDto: UpdateRoleDto) {
        const { permission, name } = updateRoleDto;
    
        const existingRole = await this.prisma.role.findUnique({
            where: { id: params.id },
            include: { permissions: true },
        });
    
        if (!existingRole) {
            throw new Error('Role not found');
        }
  
        if (!permission) {
            return this.prisma.role.update({
                where: { id: params.id },
                data: {
                    name,
                },
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            });
        }
  
        return this.prisma.role.update({
            where: { id: params.id },
            data: {
                name,
                permissions: {
              
                    create: permission.map((permissionId) => ({
                        permission: {
                            connect: { id: permissionId },
                        },
                    })),
                },
            },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }
    
    async deleteRole(roleWhereUniqueInput: Prisma.RoleWhereUniqueInput): Promise<Role> {
        await this.prisma.rolePermission.deleteMany({
            where: {
                roleId: roleWhereUniqueInput.id,
            },
        });

        return this.prisma.role.delete({
            where: roleWhereUniqueInput,
        });
    }

}
