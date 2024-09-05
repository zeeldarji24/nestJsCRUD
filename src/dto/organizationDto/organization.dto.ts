import { IsString, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    readonly name: string;
}

export class UpdateOrganizationDto {
    @IsString()
    @IsOptional()
    readonly name?: string;
}

export class GetOrganizationByIdDto {
    @IsString()
    readonly id: string;
}
