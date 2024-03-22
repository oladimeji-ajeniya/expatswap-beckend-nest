import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './module/client/client.module';
import { UsersModule } from './module/user/user.module';

const connection = `mongodb+srv://oladimeji:tAeWR4ZbBNDu9xco@cluster0.7qcq4mj.mongodb.net/?retryWrites=true&w=majority&&appName=Cluster0`;
@Module({
  imports: [
    MongooseModule.forRoot(connection),
    UsersModule,
    ClientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
