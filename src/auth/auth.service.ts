import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
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

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOneBy({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const payload: JwtPayload = { username };
      const access_token = await this.jwtService.sign(payload);

      return { access_token };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
