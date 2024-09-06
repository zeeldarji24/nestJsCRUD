// import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import * as jwt from 'jsonwebtoken';
// import { LoginDto } from 'src/dto/auth/login.dto';
// import { Employee, userCredential, Session } from '@prisma/client';

// @Injectable()
// export class AuthService {
//     constructor(private prisma: PrismaService) { }

//     async login(loginDto: LoginDto): Promise<{ message: string; token?: string }> {
//         const { email, password } = loginDto;

//         const employee = await this.prisma.employee.findUnique({
//             where: { email },
//         });

//         if (!employee) {
//             throw new UnauthorizedException('Invalid credentials');
//         }

//         const userCredentials = await this.prisma.userCredential.findMany({

//             where: { empId: employee.id },
//         });

//         if (!userCredentials.length || !(await this.verifyPassword(password, userCredentials[0].password))) {
//             throw new UnauthorizedException('Invalid credentials');
//         }

//         const token = this.generateJwtToken(employee);

//         await this.prisma.session.create({
//             data: {
//                 empId: employee.id,
//                 token,
//                 expireAt: new Date(Date.now() + 3600000),
//             },
//         });

//         return { message: 'Login successful', token };
//     }

//     private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//         return bcrypt.compare(password, hashedPassword);
//     }

//     private generateJwtToken(employee: Employee): string {
//         return jwt.sign({ id: employee.id, email: employee.email }, 'your-secret-key', { expiresIn: '1h' });
//     }
// }


import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from 'src/dto/auth/login.dto';
import { Employee, userCredential, Session } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    // Existing login method
    async login(loginDto: LoginDto): Promise<{ message: string; token?: string }> {
        const { email, password } = loginDto;

        const employee = await this.prisma.employee.findUnique({
            where: { email },
        });

        if (!employee) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userCredentials = await this.prisma.userCredential.findMany({
            where: { empId: employee.id },
        });

        if (!userCredentials.length || !(await this.verifyPassword(password, userCredentials[0].password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.generateJwtToken(employee);

        await this.prisma.session.create({
            data: {
                empId: employee.id,
                token,
                expireAt: new Date(Date.now() + 3600000), // Expires in 1 hour
            },
        });

        return { message: 'Login successful', token };
    }

    async logout(token: string): Promise<{ message: string }> {
        const session = await this.prisma.session.findFirst({
            where: { token }, 
        });

        if (!session || session.expiredAt) {
            throw new UnauthorizedException('Invalid session or already logged out');
        }

        await this.prisma.session.update({
            where: { id: session.id },  // Use session's unique ID for the update
            data: { expiredAt: new Date() }, // Mark the session as expired
        });

        return { message: 'Logout successful' };
    }


    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private generateJwtToken(employee: Employee): string {
        return jwt.sign({ id: employee.id, email: employee.email }, 'your-secret-key', { expiresIn: '1h' });
    }
}
