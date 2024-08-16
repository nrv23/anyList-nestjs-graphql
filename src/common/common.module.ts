import { Module } from '@nestjs/common';
import { JwtService } from './service/jwt.service';
import { PasswordService } from './service/password.service';

@Module({
    providers: [JwtService, PasswordService],
    exports: [
        JwtService, PasswordService
    ]
})
export class CommonModule { }
