import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponseType } from './dtos/types/auth-response.type';
import { LoginInput } from './dtos/inputs/login.input';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUserDecorator } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthResponseType, { name: "signup" })

  async signup(
    @Args('signupInput')
    signupInput: SignupInput
  ): Promise<AuthResponseType> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponseType, { name: "login" })
  async login(
    @Args('loginInput')
    loginInput: LoginInput
  ): Promise<AuthResponseType> {
    return this.authService.login(loginInput);
  }


  @Query(() => AuthResponseType, { name: "revalidateToken" })
  @UseGuards(JwtAuthGuard)

  revalidateToken(
    @CurrentUserDecorator() user: User
    // este decorador CurrentUserDecorator devuelve el usuario logueado 
    // por eso se debe usar JwtAuthGuard para que lea el token y retorne el usuario
  ): AuthResponseType {
    return this.authService.revalidateToken(user);
  }
}
