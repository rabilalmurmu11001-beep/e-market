import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/user-create-dto';
import { UsersService } from './users.service';
import { AuthenticationGuard } from 'src/common/guards/authentication/authentication.guard';
import { Role, Roles } from 'src/common/utils/decorators/role.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization/authorization.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('👤 Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('create')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async createUser(@Body() payload: CreateUserDto) {
        return await this.userService.createUser(payload);
    }

    @Get('profile')
    @UseGuards(AuthenticationGuard)
    async getUserProfile(@Req() { user }: Request & { user?: any }) {
        return await this.userService.getUserById(user.sub)
    }

}
