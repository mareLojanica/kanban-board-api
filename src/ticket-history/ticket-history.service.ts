import { Injectable } from '@nestjs/common';
import { TicketHistory } from './schema/ticket-history.schema';
import { Model } from 'mongoose';
import { ApolloError } from 'apollo-server-express';
import { Ticket } from 'src/tickets/schema/tickets.schema';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TicketHistoryService {
  constructor(
    @InjectModel(TicketHistory.name)
    private ticketHistoryModel: Model<TicketHistory>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getHistoryPerTicket(id: Pick<Ticket, 'id'>) {
    try {
      return await this.ticketHistoryModel.find({ ticketId: id }).exec();
    } catch (error) {
      throw new ApolloError(
        'Failed to fetch ticket history',
        'FETCH_USERS_ERROR',
        {
          details: error.message,
        },
      );
    }
  }

  async createHistory({
    ticketId,
    changes,
    previousState,
  }: {
    ticketId: string;
    previousState: Record<string, any>;
    changes: Record<string, any>;
  }) {
    try {
      await this.ticketHistoryModel.create({
        ticketId,
        changeDate: new Date(),
        changes,
        previousState,
      });
    } catch (error) {
      throw new ApolloError(
        'Failed to create ticket history',
        'FETCH_USERS_ERROR',
        {
          details: error.message,
        },
      );
    }
  }

  async deleteHistory(ticketId: Pick<Ticket, 'id'>) {
    try {
      const deletedTicketHistory = await this.ticketHistoryModel.deleteMany({
        ticketId,
      });

      if (!deletedTicketHistory.deletedCount) {
        throw new ApolloError('Ticket not found', 'TICKET_NOT_FOUND');
      }

      return { success: true };
    } catch (error) {
      throw new ApolloError('Failed to delete history', 'DELETE_USER_ERROR', {
        details: error.message,
      });
    }
  }
}
