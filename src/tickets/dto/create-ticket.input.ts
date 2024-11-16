import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../../types';

registerEnumType(TicketStatus, {
  name: 'TicketStatus',
  description: 'The status of a ticket',
});

@InputType()
export class CreateTicketInput {
  @Field(() => TicketStatus, { description: 'Status of the ticket' })
  @IsEnum(TicketStatus, {
    message: 'Status must be a valid TicketStatus value',
  })
  status: TicketStatus;

  @Field({ description: 'Title of the ticket' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;
}
