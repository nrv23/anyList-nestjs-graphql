import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {

    async hash(password: string): Promise<string> {
        const salt = 10;
        return await bcrypt.hash(password,salt);
    }

    async compareHash(password: string, hash:string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}