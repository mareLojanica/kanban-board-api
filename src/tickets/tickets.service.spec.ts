import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getModelToken } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Ticket } from './schema/tickets.schema';
import { Model } from 'mongoose';
import { ApolloError } from 'apollo-server-express';
import { TicketHistoryEvent, TicketStatus } from '../types';
import { TICKET_UPDATED } from '../utils/constants';

describe('TicketsService', () => {
  let service: TicketsService;
  let model: Model<Ticket>;
  let eventEmitter: EventEmitter2;

  const mockTicket = {
    _id: '6737b607f83221d26c6573d1',
    title: 'Test Ticket',
    save: jest.fn().mockResolvedValue({
      id: '6737b607f83221d26c6573d1',
      title: 'Updated Title',
    }),
    toObject: jest.fn().mockReturnValue({
      id: '6737b607f83221d26c6573d1',
      title: 'Test Ticket',
    }),

    status: 'TO_DO',
  };

  const mockTicketModel = {
    create: jest.fn().mockResolvedValue({
      id: 'mockId',
      title: 'Test',
      status: TicketStatus.TO_DO,
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockTicket]),
    }),
    findById: jest.fn().mockResolvedValue(mockTicket),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockTicket),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getModelToken(Ticket.name),
          useValue: mockTicketModel,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    model = module.get<Model<Ticket>>(getModelToken(Ticket.name));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a ticket successfully', async () => {
      const createInput = {
        title: 'Test',
        status: TicketStatus.TO_DO,
      };

      const result = await service.createTicket(createInput);

      expect(mockTicketModel.create).toHaveBeenCalledWith(createInput);
      expect(result).toEqual({
        id: 'mockId',
        title: 'Test',
        status: TicketStatus.TO_DO,
      });
    });

    it('should throw an error when ticket creation fails', async () => {
      mockTicketModel.create.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.createTicket({
          title: '',
          status: TicketStatus.DONE,
        }),
      ).rejects.toThrow(ApolloError);

      expect(mockTicketModel.create).toHaveBeenCalledWith({
        title: '',
        status: TicketStatus.DONE,
      });
    });
  });

  describe('getTickets', () => {
    it('should fetch all tickets', async () => {
      const result = await service.getTickets();

      expect(mockTicketModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual([mockTicket]);
    });

    it('should throw an error when fetching tickets fails', async () => {
      mockTicketModel.find.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error('Database error')),
      });

      await expect(service.getTickets()).rejects.toThrow(ApolloError);

      expect(mockTicketModel.find).toHaveBeenCalledWith({});
    });
  });

  describe('updateTicket', () => {
    it('should update a ticket and emit an event if changes are made', async () => {
      const updateInput = {
        id: '6737b607f83221d26c6573d1',
        title: 'Updated Title',
      };

      const result = await service.updateTicket(updateInput);

      expect(mockTicketModel.findById).toHaveBeenCalledWith(updateInput.id);
      expect(mockTicket.save).toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalledWith(TICKET_UPDATED, {
        ticketId: '6737b607f83221d26c6573d1',
        previousState: {
          id: '6737b607f83221d26c6573d1',
          title: 'Test Ticket',
        },
        changes: [
          {
            field: 'title',
            oldValue: 'Test Ticket',
            newValue: 'Updated Title',
          },
        ],
      });

      expect(result).toEqual({
        id: '6737b607f83221d26c6573d1',
        title: 'Updated Title',
      });
    });

    it('should throw an error if the ticket is not found', async () => {
      mockTicketModel.findById.mockResolvedValueOnce(null);

      await expect(service.updateTicket({ id: '123' })).rejects.toThrow(
        ApolloError,
      );

      expect(mockTicketModel.findById).toHaveBeenCalledWith('123');
    });

    it('should not emit an event if there are no changes', async () => {
      const updateInput = { id: '123' };
      await service.updateTicket(updateInput);

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket successfully', async () => {
      const ticketId = { id: '6737b607f83221d26c6573d1' };

      const result = await service.deleteTicket(ticketId);

      expect(mockTicketModel.findByIdAndDelete).toHaveBeenCalledWith(ticketId);
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if the ticket is not found', async () => {
      mockTicketModel.findByIdAndDelete.mockResolvedValueOnce(null);

      await expect(
        service.deleteTicket({ id: '6737b607f83221d26c6573dx1' }),
      ).rejects.toThrow(ApolloError);

      expect(mockTicketModel.findByIdAndDelete).toHaveBeenCalledWith({
        id: '6737b607f83221d26c6573dx1',
      });
    });
  });
});
