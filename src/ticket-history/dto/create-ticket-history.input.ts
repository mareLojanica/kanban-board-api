import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTicketHistoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
