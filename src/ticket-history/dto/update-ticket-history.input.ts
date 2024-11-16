import { IsString, IsObject, IsNotEmpty, IsEnum } from 'class-validator';
import { TicketHistoryEvent } from '../../types';

export class TicketUpdatedEventDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsObject()
  @IsNotEmpty()
  previousState: Record<string, any>;

  @IsObject()
  @IsNotEmpty()
  changes: Record<string, any>;

  @IsEnum(TicketHistoryEvent)
  @IsNotEmpty()
  event: TicketHistoryEvent;
}
