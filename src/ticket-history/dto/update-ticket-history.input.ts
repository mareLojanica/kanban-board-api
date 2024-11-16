import { IsString, IsObject, IsNotEmpty } from 'class-validator';

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
}
