import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, GetOrganizationByIdDto, UpdateOrganizationDto } from 'src/dto/organizationDto/organization.dto';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Post()
    async createOrganization(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        return await this.organizationService.createOrganization(createOrganizationDto);
    }

    @Get()
    async getOrganization(): Promise<{ message: string; data?: Organization[] }> {
        const organizations = await this.organizationService.getOrganization();
        if (organizations.length === 0) {
            return { message: 'No organizations found' };
        }
        return { message: 'Organizations retrieved successfully', data: organizations };
    }

    @Get(':id')
    async getOrganizationById(@Param() params: GetOrganizationByIdDto): Promise<{ message: string; data?: Organization }> {
        const organization = await this.organizationService.getOrganizationById(params);
        if (!organization) {
            return { message: 'Organization not found' };
        }
        return { message: 'Organization retrieved successfully', data: organization };
    }

    @Put(':id')
    async updateOrganization(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
        return await this.organizationService.updateOrganization({ id }, updateOrganizationDto);
    }

    @Delete(':id')
    async deleteOrganization(@Param('id') id: string): Promise<{ message: string; data?: Organization }> {
        const organization = await this.organizationService.deleteOrganization({ id }, { isDeleted: true });

        return { message: 'Organization soft-deleted successfully', data: organization };
    }
}
