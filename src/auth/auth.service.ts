import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from 'src/dto/auth/login.dto';
import { Employee, userCredential, Session } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

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
                expireAt: new Date(Date.now() + 3600000),
            },
        });

        return { message: 'Login successful', token };
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private generateJwtToken(employee: Employee): string {
        return jwt.sign({ id: employee.id, email: employee.email }, 'your-secret-key', { expiresIn: '1h' });
    }
}
