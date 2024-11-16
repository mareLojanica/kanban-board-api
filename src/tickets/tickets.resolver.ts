import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './schema/tickets.schema';
import { SuccessResponse } from '../utils/delete.envelope.response';
import { SearchTicketsInput } from './dto/search-ticket.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/Jwt.guard';

@Resolver(() => Ticket)
@UseGuards(JwtAuthGuard)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Mutation(() => Ticket)
  async createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput, // Corrected argument name
  ): Promise<Ticket> {
    return this.ticketsService.createTicket(createTicketInput);
  }

  @Query(() => [Ticket])
  async getTickets(
    @Args('searchTicketsInput', {
      type: () => SearchTicketsInput,
      nullable: true,
    })
    searchTicketsInput: SearchTicketsInput,
  ): Promise<Ticket[]> {
    const tickets = await this.ticketsService.getTickets(
      searchTicketsInput?.searchText,
    );
    return tickets;
  }

  @Mutation(() => Ticket)
  async updateTicket(
    @Args('updateTicketInput') updateTicketInput: UpdateTicketInput,
  ): Promise<Ticket> {
    return this.ticketsService.updateTicket(updateTicketInput);
  }

  @Mutation(() => SuccessResponse, { nullable: true })
  async deleteTicket(
    @Args('id', { type: () => String }) id: Pick<Ticket, 'id'>,
  ): Promise<SuccessResponse> {
    return this.ticketsService.deleteTicket(id);
  }
}
