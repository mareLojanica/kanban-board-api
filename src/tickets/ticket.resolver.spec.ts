import { Test, TestingModule } from '@nestjs/testing';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { SuccessResponse } from '../utils/delete.envelope.response';
import { SearchTicketsInput } from './dto/search-ticket.input';
import { TicketStatus } from '../types';

describe('TicketsResolver', () => {
  let resolver: TicketsResolver;
  let service: TicketsService;

  const mockTicket = {
    id: '6737b609f83221d26c6573e5',
    title: 'Test Ticket',
    description: 'This is a test ticket',
    status: TicketStatus.TO_DO,
  };

  const mockSuccessResponse: SuccessResponse = { success: true };

  const mockTicketsService = {
    createTicket: jest.fn().mockResolvedValue(mockTicket),
    getTickets: jest.fn().mockResolvedValue([mockTicket]),
    updateTicket: jest.fn().mockResolvedValue(mockTicket),
    deleteTicket: jest.fn().mockResolvedValue(mockSuccessResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsResolver,
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    resolver = module.get<TicketsResolver>(TicketsResolver);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create a ticket successfully', async () => {
      const createTicketInput: CreateTicketInput = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        status: TicketStatus.TO_DO,
      };

      const result = await resolver.createTicket(createTicketInput);

      expect(service.createTicket).toHaveBeenCalledWith(createTicketInput);
      expect(result).toEqual(mockTicket);
    });
  });

  describe('getTickets', () => {
    it('should return tickets without search text', async () => {
      const result = await resolver.getTickets(null);

      expect(service.getTickets).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockTicket]);
    });

    it('should return tickets with search text', async () => {
      const searchTicketsInput: SearchTicketsInput = {
        searchText: 'Test',
      };

      const result = await resolver.getTickets(searchTicketsInput);

      expect(service.getTickets).toHaveBeenCalledWith('Test');
      expect(result).toEqual([mockTicket]);
    });
  });

  describe('updateTicket', () => {
    it('should update a ticket successfully', async () => {
      const updateTicketInput: UpdateTicketInput = {
        id: '1',
        title: 'Updated Ticket',
      };

      const result = await resolver.updateTicket(updateTicketInput);

      expect(service.updateTicket).toHaveBeenCalledWith(updateTicketInput);
      expect(result).toEqual(mockTicket);
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket successfully', async () => {
      const ticketId = { id: '1' };

      const result = await resolver.deleteTicket(ticketId);

      expect(service.deleteTicket).toHaveBeenCalledWith(ticketId);
      expect(result).toEqual(mockSuccessResponse);
    });
  });
});
