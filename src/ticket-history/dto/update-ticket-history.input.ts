import { CreateTicketHistoryInput } from './create-ticket-history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTicketHistoryInput extends PartialType(CreateTicketHistoryInput) {
  @Field(() => Int)
  id: number;
}
