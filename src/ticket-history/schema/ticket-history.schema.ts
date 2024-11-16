import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Ticket } from '../../tickets/schema/tickets.schema';

@ObjectType()
@Schema({ timestamps: true })
export class TicketHistory extends Document {
  @Field(() => ID)
  id: string;

  @Prop({ required: true })
  @Field()
  ticketId: string;

  @Prop({ type: Object, required: true })
  @Field(() => Ticket)
  previousState: Partial<Ticket>;

  @Prop({ type: [Object], required: true })
  @Field(() => [Change], { nullable: true })
  changes: Change[];
}

@ObjectType()
export class Change {
  @Field(() => String)
  field: string;

  @Field(() => String, { nullable: true })
  oldValue: string;

  @Field(() => String, { nullable: true })
  newValue: string;
}

export const TicketHistorySchema = SchemaFactory.createForClass(TicketHistory);
