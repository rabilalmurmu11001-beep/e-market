import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';

export function handleMongoError(error: unknown): never {
    // Duplicate key error
    if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as any).code === 11000
    ) {
        const field = Object.keys((error as any).keyPattern ?? {})[0];
        throw new ConflictException(`${field} already exists.`);
    }

    // Invalid ObjectId
    if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
            `Invalid ${error.path}: ${error.value}`,
        );
    }

    // Validation Error
    if (error instanceof MongooseError.ValidationError) {
        const errors = Object.values(error.errors).map(
            (err) => err.message,
        );

        throw new BadRequestException(errors);
    }

    // Document not found
    if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new NotFoundException('Document not found.');
    }

    console.error(error);

    throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
    );
}