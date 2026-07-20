import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/utils/decorators/role.decorator';

export type UserDocument = HydratedDocument<User>;


@Schema({
    timestamps: true,
})
export class User {
    @Prop({
        required: true,
        trim: true,
    })
    name!: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email!: string;

    @Prop({
        unique: true,
        sparse: true,
        trim: true,
    })
    mobile?: string;

    @Prop({
        required: true,
        select: false,
    })
    password!: string;

    @Prop({
        enum: Role,
        default: Role.USER,
    })
    role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);