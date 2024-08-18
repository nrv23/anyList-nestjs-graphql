import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./../../users/entities/user.entity";
import { JWTPayload } from "../interface/jwt-payload.interface";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // esta clase se encarga de validar el token 

    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            secretOrKey: configService.get("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // en donde la estrategia obtiene el token en cada llaado http
        });
    }
    
    async validate(payload: JWTPayload): Promise<User> { // la funcion que valida eltoken en cada llamada
        const { id } = payload;
        const user = await this.authService.validateUser(id);
        return user;
    }
}