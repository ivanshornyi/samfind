import { Injectable, NotFoundException } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { UserAuthType, UserRole, UserStatus } from "./types/user";
import { UpdateUserDto } from "./dto/update-user-dto";
import { CreateUserDto } from "./dto/create-user-dto";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(offset: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user || null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      status: UserStatus.Active,
      role: UserRole.Customer,
    });

    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string, authType: UserAuthType): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        authType,
      },
    });

    return user || null;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, resetPassword?: boolean): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password && !resetPassword) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = Object.assign(user, updateUserDto);
    await this.userRepository.save(updatedUser);

    return updatedUser;
  }

  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    
    return bcrypt.hash(password, saltRounds);
  }
}
