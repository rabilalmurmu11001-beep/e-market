import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class ProductColor {
    @Prop({
        required: true,
        trim: true,
    })
    name!: string;

    @Prop({
        required: true,
    })
    code!: string;

    @Prop({
        required: true,
        min: 0,
    })
    price!: number;

    @Prop({
        required: true,
        min: 0,
        default: 0,
    })
    stock!: number;
}

export const ProductColorSchema =
    SchemaFactory.createForClass(ProductColor);

@Schema({ _id: false })
export class ProductImage {
    @Prop({
        required: true,
    })
    id!: string;

    @Prop({
        required: true,
    })
    url!: string;

    @Prop({
        required: true,
    })
    color!: string;
}

export const ProductImageSchema =
    SchemaFactory.createForClass(ProductImage);

@Schema({
    timestamps: true,
})
export class Product {
    @Prop({
        required: true,
        trim: true,
    })
    name!: string;

    @Prop({
        required: true,
        trim: true,
    })
    category!: string;

    @Prop({
        required: true,
        min: 0,
    })
    price!: number;

    @Prop({
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    })
    sku!: string;

    @Prop({
        required: true,
        min: 0,
        default: 0,
    })
    stock!: number;

    @Prop()
    imageUrl?: string;

    @Prop({
        type: [ProductImageSchema],
        default: [],
    })
    images?: ProductImage[];

    @Prop({
        type: [ProductColorSchema],
        default: [],
    })
    colors?: ProductColor[];

    @Prop({
        default: true,
    })
    isActive!: boolean;
}

export const ProductSchema =
    SchemaFactory.createForClass(Product);