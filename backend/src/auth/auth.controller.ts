import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginCredentialDto } from 'src/users/dto/user-create-dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('🔐 Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { };

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() registerPayload: CreateUserDto) {
        return await this.authService.register(registerPayload);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginCredential: LoginCredentialDto) {
        return await this.authService.login(loginCredential);
    }

}
