import { Test, TestingModule } from '@nestjs/testing';
import { TicketHistoryResolver } from './ticket-history.resolver';
import { TicketHistoryService } from './ticket-history.service';
import { JwtAuthGuard } from '../guards/Jwt.guard';
import { ExecutionContext } from '@nestjs/common';

describe('TicketHistoryResolver', () => {
  let resolver: TicketHistoryResolver;
  let service: TicketHistoryService;

  const mockTicketHistory = [
    {
      id: '6737d0f60595faa64ee468ab',
      ticketId: '6737b607f83221d26c6573d1',
      changeDate: new Date(),
      previousState: {
        title: 'Old Title',
        description: 'Old Description',
        status: 'TO_DO',
      },
      changes: {
        title: 'Old Title',
      },
    },
  ];

  const mockTicketHistoryService = {
    getHistoryPerTicket: jest.fn().mockResolvedValue(mockTicketHistory),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketHistoryResolver,
        {
          provide: TicketHistoryService,
          useValue: mockTicketHistoryService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    resolver = module.get<TicketHistoryResolver>(TicketHistoryResolver);
    service = module.get<TicketHistoryService>(TicketHistoryService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findHistoryPerTicket', () => {
    it('should return ticket history for a given ticket ID', async () => {
      const ticketId = { id: '6737b607f83221d26c6573d1' };

      const result = await resolver.findHistoryPerTicket(ticketId);

      expect(service.getHistoryPerTicket).toHaveBeenCalledWith(ticketId);
      expect(result).toEqual(mockTicketHistory);
    });

    it('should throw an error if the service throws', async () => {
      mockTicketHistoryService.getHistoryPerTicket.mockRejectedValueOnce(
        new Error('Service Error'),
      );

      const ticketId = { id: '6737b607f83221d26c6573d1' };

      await expect(resolver.findHistoryPerTicket(ticketId)).rejects.toThrow(
        'Service Error',
      );
      expect(service.getHistoryPerTicket).toHaveBeenCalledWith(ticketId);
    });
  });
});
