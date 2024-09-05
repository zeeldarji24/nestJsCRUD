// src/organization/organization.service.ts

import { Injectable } from '@nestjs/common';
import { Organization, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from 'src/dto/organizationDto/organization.dto';

@Injectable()
export class OrganizationService {
    constructor(private readonly prisma: PrismaService) { }

    async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        const result = await this.prisma.organization.create({
            data: createOrganizationDto,
        })
        return result;
    }

    async getOrganization(): Promise<Organization[]> {
        const result = await this.prisma.organization.findMany();
        return result;
    }

    async getOrganizationById(organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput): Promise<Organization> {
        const result = await this.prisma.organization.findUnique({
            where: organizationWhereUniqueInput,
        });

        return result;
    }

    async updateOrganization(organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
        const result = await this.prisma.organization.update({
            where: organizationWhereUniqueInput,
            data: updateOrganizationDto,
        });
        return result;
    }

    async deleteOrganization(organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput, organizationData: Prisma.OrganizationUpdateInput): Promise<Organization> {
        const result = await this.prisma.organization.update({
            where: organizationWhereUniqueInput,
            data: organizationData,
        });
        return result;
    }
}
