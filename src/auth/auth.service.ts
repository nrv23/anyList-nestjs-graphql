import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponseType } from './dtos/types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dtos/inputs/login.input';
import { PasswordService } from 'src/common/service/password.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    private logger: Logger = new Logger('auth.service')

    constructor(
        private readonly userService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService
    ) { }
    private getJwtToken(userId: string) {
        return this.jwtService.sign({ id: userId });
    }
    async signup(signupInput: SignupInput): Promise<AuthResponseType> {

        try {
            const user = await this.userService.create(signupInput);
            const response = new AuthResponseType();

            response.token = this.getJwtToken(user.id);
            response.user = user;
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login({ email, password }: LoginInput): Promise<AuthResponseType> {

        try {
            const user = await this.userService.findOneByEmail(email);
            const matched = await this.passwordService.compareHash(password, user.password)
            const response = new AuthResponseType();
            // agregar validacion para usuario inactivo
            if (!matched) this.handleError({ code: '23456', details: 'Datos de autenticación incorrectos' });

            response.token = this.getJwtToken(user.id);
            response.user = user;
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async validateUser(id: string): Promise<User> {
        const user = await this.userService.findOneById(id);
        if (!user.isActive) throw new ForbiddenException("User is inactive");
        delete user.password;
        return user;
    }

    revalidateToken(user: User): AuthResponseType {

        const response = new AuthResponseType();
        response.token = this.getJwtToken(user.id);
        response.user = user;
        return response;
    }

    private handleError(error: any) {

        console.log(error)
        this.logger.debug(error);

        if (error.code === "23505") throw new BadRequestException(error.detail);
        throw new InternalServerErrorException("Internal Error. Check logs")
    }
}
