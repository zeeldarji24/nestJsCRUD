// import { Controller, Post, Body, BadRequestException, NotFoundException, Req } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LoginDto } from 'src/dto/auth/login.dto';

// @Controller('auth')
// export class AuthController {
//     constructor(private authService: AuthService) { }

//     @Post('login')
//     async login(@Body() loginDto: LoginDto): Promise<{ message: string; token?: string }> {
//         try {
//             return await this.authService.login(loginDto);
//         } catch (error) {
//             throw new BadRequestException(error.message);
//         }
//     }
// }


import { Controller, Post, Body, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth/login.dto';
import { Request } from 'express';

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

    @Post('logout')
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
