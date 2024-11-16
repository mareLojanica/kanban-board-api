import { Resolver, Query, Args } from '@nestjs/graphql';
import { TicketHistoryService } from './ticket-history.service';

import { Ticket } from 'src/tickets/schema/tickets.schema';
import { TicketHistory } from './schema/ticket-history.schema';
import { JwtAuthGuard } from '../guards/Jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => TicketHistory)
@UseGuards(JwtAuthGuard)
export class TicketHistoryResolver {
  constructor(private readonly ticketHistoryService: TicketHistoryService) {}

  @Query(() => [TicketHistory])
  findHistoryPerTicket(
    @Args('id', { type: () => String }) id: Pick<Ticket, 'id'>,
  ) {
    return this.ticketHistoryService.getHistoryPerTicket(id);
  }
}
