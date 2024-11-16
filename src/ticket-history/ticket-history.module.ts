import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TicketHistory,
  TicketHistorySchema,
} from './schema/ticket-history.schema';
import { TicketHistoryService } from './ticket-history.service';
import { TicketHistoryResolver } from './ticket-history.resolver';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketHistory.name, schema: TicketHistorySchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [TicketHistoryResolver, TicketHistoryService],
  exports: [TicketHistoryService],
})
export class TicketHistoryModule {}
