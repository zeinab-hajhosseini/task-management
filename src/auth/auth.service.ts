import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.usersRepository.create({ username, password });

    try {
      await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        //Duplicate Username
        throw new ConflictException('This username is already exist.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
