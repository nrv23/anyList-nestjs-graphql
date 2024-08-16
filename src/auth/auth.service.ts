import {  Injectable } from '@nestjs/common';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponseType } from './dtos/types/auth-response.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService
    ) {}

    async signup(signupInput: SignupInput): Promise<AuthResponseType> {

        const user = await this.userService.create(signupInput);
        const response = new AuthResponseType();

        response.token = "sdsdsadsada";
        response.user = user;
        return response;
    }

   
}
