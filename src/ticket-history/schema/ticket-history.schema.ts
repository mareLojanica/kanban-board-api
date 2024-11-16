import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { Ticket } from '../../tickets/schema/tickets.schema';
import { TicketHistoryEvent } from '../../types';

registerEnumType(TicketHistoryEvent, {
  name: 'TicketHistoryEvent',
});

@ObjectType()
@Schema({ timestamps: true })
export class TicketHistory extends Document {
  @Field(() => ID)
  id: string;

  @Prop({ required: true })
  @Field()
  ticketId: string;

  @Prop({ required: true })
  @Field()
  changeDate: Date;

  @Prop({ type: Object, required: true })
  @Field(() => Ticket)
  previousState: Partial<Ticket>;

  @Prop({ type: [Object], required: true })
  @Field(() => [Change], { nullable: true })
  changes: Change[];

  @Prop({ required: true, enum: TicketHistoryEvent })
  @Field(() => TicketHistoryEvent)
  event: TicketHistoryEvent;
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
