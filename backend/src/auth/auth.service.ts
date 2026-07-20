import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/user-create-dto';
import * as bcrypt from 'bcrypt';
import { handleMongoError } from 'src/common/utils/mongoose-error-util';
import { JwtService } from '@nestjs/jwt';
import { AppResponse } from 'src/common/utils/app-response';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async register(registerPayload: CreateUserDto) {
        try {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(registerPayload.password, saltOrRounds);
            const user = (await this.userModel.create({ ...registerPayload, password: hash })).toObject();
            const token = await this.jwtService.signAsync({ sub: user._id, role: user.role, email: user.email });
            const { password, ...userData } = user;
            return new AppResponse(201, 'Registration successfull', { user: userData, token })
        } catch (error) {
            handleMongoError(error);
        }
    }

    async login(loginCredential: { email: string, password: string }) {
        try {
            const user = await this.userModel.findOne({ email: loginCredential.email }).select('+password');
            if (!user) {
                throw new NotFoundException(`User not exist with this email: ${loginCredential.email}`)
            }

            const passwordIsCorrect = await bcrypt.compare(loginCredential.password, user.password);
            if (!passwordIsCorrect) {
                throw new BadRequestException(`Invalid email or password`);
            }

            const token = await this.jwtService.signAsync({ sub: user._id, role: user.role, email: user.email });

            const { password, ...userData } = user.toObject();
            return new AppResponse(200, 'Login successfull', { user: userData, token })
        } catch (error) {
            handleMongoError(error);
        }
    }
}
