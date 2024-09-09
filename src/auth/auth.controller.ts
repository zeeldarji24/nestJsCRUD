import { Controller, Post, Body, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth/login.dto';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: LoginDto): Promise<{ message: string; token?: string }> {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('logout')
    @ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async logout(@Req() req: Request): Promise<{ message: string }> {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            return await this.authService.logout(token);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
