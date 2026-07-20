import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/user-create-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { handleMongoError } from 'src/common/utils/mongoose-error-util';
import { AppResponse } from 'src/common/utils/app-response';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }


    async createUser(createUserPayload: CreateUserDto) {
        try {
            const newUser = new this.userModel(createUserPayload);
            const user = (await newUser.save()).toObject();
            return new AppResponse(201, 'User created successfully', { user });
        } catch (error) {
            handleMongoError(error);
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.userModel.findOne({
                email: email
            });
            if (!user) {
                throw new NotFoundException(`User not exist with this email: ${email}`)
            }

            return new AppResponse(200, "User retrive successfully", { user: user.toObject() })
        } catch (error) {
            handleMongoError(error);
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new NotFoundException(`User not found`);
            }
            return new AppResponse(200, 'User retrive successfully', { user: user.toObject() });
        } catch (error) {
            handleMongoError(error);
        }
    }

    async updateUser(id: string, payload: Partial<CreateUserDto>) {
        try {
            const user = await this.userModel.findByIdAndUpdate(id, payload);
            if (!user) {
                throw new NotFoundException(`User not found`);
            }
            return new AppResponse(200, 'User updated successfully', { user: user.toObject() });
        } catch (error) {
            handleMongoError(error);
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.userModel.findByIdAndDelete(id);

            return new AppResponse(200, 'User deleted successfully', { user: user?.toObject() });
        } catch (error) {
            handleMongoError(error);
        }
    }
}
