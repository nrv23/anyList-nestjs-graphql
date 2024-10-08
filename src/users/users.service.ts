import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from './../auth/dtos/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/common/service/password.service';
import { ValidRoles } from './../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {


  private logger: Logger = new Logger('user.service')

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly password: PasswordService
  ) {

  }

  async create(signupInput: SignupInput): Promise<User> {

    try {
      const user = this.userRepo.create({
        ...signupInput,
        password: await this.password.hash(signupInput.password)
      });
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll(validRoles: ValidRoles[]): Promise<User[]> {

    if (validRoles.length === 0) return this.userRepo.find(
      /*{
      relations: {
        lastUpdatedBy: true
      }
    }*/
    );

    return this.userRepo.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', validRoles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOneBy({
      email
    });

    if (!user) throw new NotFoundException("No se encontró un usuario");
    return user;
  }

  async findOneById(id: string): Promise<User> {
    console.log({ id })
    const user = await this.userRepo.findOneBy({
      id
    });

    if (!user) throw new NotFoundException("No se encontró un usuario");
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput, updateBy: User): Promise<User> {
    try {
      const user = await this.findOneById(id);
      const updateUser: User = {
        ...user,
        ...updateUserInput,
        lastUpdatedBy: updateBy,
        password: await this.password.hash(updateUserInput.password),
        id
      };
      await this.userRepo.save(updateUser);
      return updateUser;

    } catch (error) {
      this.handleError(error);
    }
  }

  async blockUser(id: string, user: User): Promise<User> {

    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy = user;
    this.userRepo.save(userToBlock);
    return userToBlock;
  }

  private handleError(error: any) {

    this.logger.debug(error);

    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException("Internal Error. Check logs")
  }
}
