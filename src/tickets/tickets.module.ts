import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsResolver } from './tickets.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schema/tickets.schema';
import {
  TicketHistory,
  TicketHistorySchema,
} from 'src/ticket-history/schema/ticket-history.schema';
import { TicketHistoryListener } from 'src/ticket-history/ticket-history.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TicketHistoryService } from 'src/ticket-history/ticket-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: TicketHistory.name, schema: TicketHistorySchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    TicketsResolver,
    TicketsService,
    TicketHistoryListener,
    TicketHistoryService,
  ],
})
export class TicketsModule {}
