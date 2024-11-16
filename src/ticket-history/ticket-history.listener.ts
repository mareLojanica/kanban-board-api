import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TicketHistoryService } from './ticket-history.service';
import { Ticket } from 'src/tickets/schema/tickets.schema';
import { TICKET_DELETED, TICKET_UPDATED } from '../utils/constants';
import { TicketUpdatedEventDto } from './dto/update-ticket-history.input';

@Injectable()
export class TicketHistoryListener {
  constructor(private readonly ticketHistoryService: TicketHistoryService) {}

  @OnEvent(TICKET_UPDATED)
  async handleTicketUpdatedEvent(event: TicketUpdatedEventDto) {
    return this.ticketHistoryService.createHistory(event);
  }

  @OnEvent(TICKET_DELETED)
  async handleDeleteHistory(event: { ticketId: Pick<Ticket, 'id'> }) {
    return this.ticketHistoryService.deleteHistory(event.ticketId);
  }
}
