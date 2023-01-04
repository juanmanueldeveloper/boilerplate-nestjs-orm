import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '.';
import { UsersService } from '.';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  providers: [UsersService],
})
export class UserModule {}
