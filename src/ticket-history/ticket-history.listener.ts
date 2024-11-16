import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TicketHistoryService } from './ticket-history.service';
import { Ticket } from 'src/tickets/schema/tickets.schema';

@Injectable()
export class TicketHistoryListener {
  constructor(private readonly ticketHistoryService: TicketHistoryService) {}

  @OnEvent('ticket.updated')
  async handleTicketUpdatedEvent(event: {
    ticketId: string;
    previousState: Record<string, any>;
    changes: Record<string, any>;
  }) {
    return this.ticketHistoryService.createHistory(event);
  }

  @OnEvent('ticket.deleted')
  async handleDeleteHistory(event: { ticketId: Pick<Ticket, 'id'> }) {
    return this.ticketHistoryService.deleteHistory(event.ticketId);
  }
}
