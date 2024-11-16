import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class SearchTicketsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Search text must be a string' })
  @MinLength(3, { message: 'Search text must be at least 3 characters long' })
  searchText?: string;
}
