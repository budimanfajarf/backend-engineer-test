import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bcryptConstants } from 'src/auth/constants';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...restData } = createUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });

    if (existingUser) {
      throw new HttpException(
        `Email ${email} already used.`,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      bcryptConstants.saltOrRounds,
    );

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      ...restData,
    });

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy(where);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const findedUser = await this.findOneBy({ id });

    if (!findedUser)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    const { email, ...restData } = updateUserDto;

    if (email && findedUser.email !== email) {
      const existingUser = await this.findOneBy({ email });

      if (existingUser) {
        throw new HttpException(
          `Email ${email} already used.`,
          HttpStatus.CONFLICT,
        );
      }
    }

    await this.usersRepository.update({ id }, { email, ...restData });
  }

  async remove(id: string): Promise<void> {
    const findedUser = await this.findOneBy({ id });

    if (!findedUser)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    await this.usersRepository.delete(id);
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const findedUser = await this.findOneBy({ id });

    if (!findedUser)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    const { password } = updateUserPasswordDto;
    const hashedPassword = await bcrypt.hash(
      password,
      bcryptConstants.saltOrRounds,
    );

    Logger.log(hashedPassword);

    await this.usersRepository.update({ id }, { password: hashedPassword });
  }
}
