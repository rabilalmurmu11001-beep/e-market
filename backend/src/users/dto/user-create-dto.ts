import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ type: String, nullable: true })
  mobile?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginCredentialDto {
  @ApiProperty({type: String})
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({type: String})
  @IsString()
  @IsNotEmpty()
  password!: string;
}