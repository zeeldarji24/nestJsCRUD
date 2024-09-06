import { Controller, Post, Body, BadRequestException, NotFoundException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{ message: string; token?: string }> {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
