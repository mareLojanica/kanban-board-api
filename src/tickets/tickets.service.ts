import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { ApolloError } from 'apollo-server-express';
import { Ticket } from './schema/tickets.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SuccessResponse } from '../utils/delete.envelope.response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TICKET_DELETED, TICKET_UPDATED } from '../utils/constants';
import { TicketHistoryEvent } from '../types';

@Injectable()
export class TicketsService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
  ) {}

  async createTicket({ title, description, status }: CreateTicketInput) {
    try {
      const ticket = await this.ticketModel.create({
        title,
        description,
        status,
      });
      this.eventEmitter.emit(TICKET_UPDATED, {
        ticketId: ticket.id,
        previousState: {},
        changes: {},
        event: TicketHistoryEvent.CREATED,
      });
      return ticket;
    } catch (error) {
      throw new ApolloError('Failed to create ticket', 'CREATE_USER_ERROR', {
        details: error.message,
      });
    }
  }

  async getTickets(searchText?: string) {
    try {
      // maybe handle getting data with some pagination
      let filters = {};
      if (searchText) {
        filters = {
          $or: [
            { title: { $regex: searchText.trim(), $options: 'i' } },
            { description: { $regex: searchText.trim(), $options: 'i' } },
          ],
        };
      }
      return await this.ticketModel.find(filters).exec();
    } catch (error) {
      throw new ApolloError('Failed to fetch tickets', 'CREATE_USER_ERROR', {
        details: error.message,
      });
    }
  }

  async updateTicket({ id, ...updates }: UpdateTicketInput) {
    try {
      const existingTicket = await this.ticketModel.findById(id);
      if (!existingTicket) {
        throw new ApolloError('Ticket not found', 'TICKET_NOT_FOUND');
      }
      const changes = [];

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== existingTicket[key]) {
          changes.push({
            oldValue: existingTicket[key],
            newValue: updates[key],
            field: key,
          });
          existingTicket[key] = updates[key];
        }
      });
      const previousState = existingTicket.toObject();
      const updatedTicket = await existingTicket.save();

      if (Object.keys(changes).length) {
        this.eventEmitter.emit(TICKET_UPDATED, {
          ticketId: id,
          previousState,
          changes,
          event: TicketHistoryEvent.UPDATED,
        });
      }

      return updatedTicket;
    } catch (error) {
      throw new ApolloError('Failed to update ticket', 'FETCH_USERS_ERROR', {
        details: error.message,
      });
    }
  }

  async deleteTicket(id: Pick<Ticket, 'id'>): Promise<SuccessResponse> {
    try {
      const deletedTicket = await this.ticketModel.findByIdAndDelete(id);

      if (!deletedTicket) {
        throw new ApolloError('Ticket not found', 'TICKET_NOT_FOUND');
      }
      this.eventEmitter.emit(TICKET_DELETED, {
        ticketId: id,
      });
      return { success: true };
    } catch (error) {
      throw new ApolloError('Failed to delete ticket', 'DELETE_USER_ERROR', {
        details: error.message,
      });
    }
  }
}
