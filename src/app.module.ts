import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from './database/database.module';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { envValidationSchema } from './configure.validation';
import { UserModule } from './user/user.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { TicketHistoryModule } from './ticket-history/ticket-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    UserModule,
    TicketsModule,
    AuthModule,
    TicketHistoryModule,
  ],
})
export class AppModule {}
