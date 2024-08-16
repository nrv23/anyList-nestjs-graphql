import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponseType } from './dtos/types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseType, { name: "signup"})

  async signup(
    @Args('signupInput')  
    signupInput: SignupInput
  ): Promise<AuthResponseType> {
    return this.authService.signup(signupInput);
  }

 /* @Mutation(() => , { name: "login"})

  async login() {

  }

  @Query(() => , { name:" revalidateToken" })
  async revalidateToken() {

  }*/
}
