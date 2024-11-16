import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'ID is required' })
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;
}
