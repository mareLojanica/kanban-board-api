import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketStatus } from '../../types';

@ObjectType()
@Schema()
export class Ticket extends Document {
  @Field(() => ID)
  id: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ required: true })
  @Field()
  description: string;

  @Prop({ required: true })
  @Field()
  status: TicketStatus;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.set('toJSON', { virtuals: true });
TicketSchema.set('toObject', { virtuals: true });
