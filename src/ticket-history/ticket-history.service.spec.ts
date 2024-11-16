import { Test, TestingModule } from '@nestjs/testing';
import { TicketHistoryService } from './ticket-history.service';
import { getModelToken } from '@nestjs/mongoose';
import { TicketHistory } from './schema/ticket-history.schema';
import { Model } from 'mongoose';
import { ApolloError } from 'apollo-server-express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TicketHistoryEvent, TicketStatus } from '../types';

describe('TicketHistoryService', () => {
  let service: TicketHistoryService;
  let model: Model<TicketHistory>;
  let eventEmitter: EventEmitter2;

  const mockTicketHistory = [
    {
      id: '6737d0f60595faa64ee468ab',
      ticketId: '6737b607f83221d26c6573d1',
      changedBy: 'admin',
      changeDate: new Date(),
      previousState: {
        title: 'Old Title',
        status: TicketStatus.TO_DO,
      },
      changes: {
        title: { oldValue: 'Old Title', newValue: 'New Title' },
      },
    },
  ];

  const mockTicketHistoryModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockTicketHistory),
    create: jest.fn().mockResolvedValue(true),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketHistoryService,
        {
          provide: getModelToken(TicketHistory.name),
          useValue: mockTicketHistoryModel,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<TicketHistoryService>(TicketHistoryService);
    model = module.get<Model<TicketHistory>>(getModelToken(TicketHistory.name));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHistoryPerTicket', () => {
    it('should return ticket history for a given ticket ID', async () => {
      const ticketId = { id: '6737b607f83221d26c6573d1' };

      const result = await service.getHistoryPerTicket(ticketId);

      expect(model.find).toHaveBeenCalledWith({ ticketId });
      expect(result).toEqual(mockTicketHistory);
    });

    it('should throw an ApolloError when there is a database error', async () => {
      mockTicketHistoryModel.exec.mockRejectedValueOnce(
        new Error('Database error'),
      );

      const ticketId = { id: '6737b607f83221d26c6573d1' };

      await expect(service.getHistoryPerTicket(ticketId)).rejects.toThrow(
        ApolloError,
      );
      expect(model.find).toHaveBeenCalledWith({ ticketId });
    });
  });

  describe('createHistory', () => {
    it('should create a history record successfully', async () => {
      const historyInput = {
        ticketId: '6737b607f83221d26c6573d1',
        changes: {
          title: { oldValue: 'Old Title', newValue: 'New Title' },
        },
        previousState: {
          title: 'Old Title',
          status: TicketStatus.TO_DO,
        },
        event: TicketHistoryEvent.CREATED,
      };

      const result = await service.createHistory(historyInput);

      expect(mockTicketHistoryModel.create).toHaveBeenCalledWith({
        ticketId: '6737b607f83221d26c6573d1',
        changeDate: expect.any(Date),
        changes: historyInput.changes,
        previousState: historyInput.previousState,
      });
      expect(result).toBeUndefined();
    });

    it('should throw an ApolloError when history creation fails', async () => {
      mockTicketHistoryModel.create.mockRejectedValueOnce(
        new Error('Database error'),
      );

      const historyInput = {
        ticketId: '6737b607f83221d26c6573d1',
        changes: {
          title: { oldValue: 'Old Title', newValue: 'New Title' },
        },
        previousState: {
          title: 'Old Title',
          status: TicketStatus.TO_DO,
        },
        event: TicketHistoryEvent.CREATED,
      };

      await expect(service.createHistory(historyInput)).rejects.toThrow(
        ApolloError,
      );
      expect(mockTicketHistoryModel.create).toHaveBeenCalledWith({
        ticketId: '6737b607f83221d26c6573d1',
        changeDate: expect.any(Date),
        changes: historyInput.changes,
        previousState: historyInput.previousState,
      });
    });
  });

  describe('deleteHistory', () => {
    it('should delete history records successfully', async () => {
      const ticketId = { id: '6737b607f83221d26c6573d1' };

      const result = await service.deleteHistory(ticketId);

      expect(mockTicketHistoryModel.deleteMany).toHaveBeenCalledWith({
        ticketId,
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw an ApolloError when no records are found to delete', async () => {
      mockTicketHistoryModel.deleteMany.mockResolvedValueOnce({
        deletedCount: 0,
      });

      const ticketId = { id: '1' };

      await expect(service.deleteHistory(ticketId)).rejects.toThrow(
        ApolloError,
      );
      expect(mockTicketHistoryModel.deleteMany).toHaveBeenCalledWith({
        ticketId,
      });
    });

    it('should throw an ApolloError when history deletion fails', async () => {
      mockTicketHistoryModel.deleteMany.mockRejectedValueOnce(
        new Error('Database error'),
      );

      const ticketId = { id: '6737b607f83221d26c6573d1' };

      await expect(service.deleteHistory(ticketId)).rejects.toThrow(
        ApolloError,
      );
      expect(mockTicketHistoryModel.deleteMany).toHaveBeenCalledWith({
        ticketId,
      });
    });
  });
});
