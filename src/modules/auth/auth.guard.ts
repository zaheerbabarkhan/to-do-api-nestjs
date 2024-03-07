import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Payload } from 'src/types/jwt.types';
import { User, UserDocument } from '../../schemas/User.schema';
import status from '../../constants/status';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
        private readonly redisService: RedisService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        let payload: Payload
        try {
            payload = await this.jwtService.verifyAsync(token) as Payload;

            const blacklistedToken = await this.redisService.getUserToken(payload.userId);
            if (blacklistedToken && blacklistedToken === token) {
                throw new UnauthorizedException();
            }
        } catch {
            throw new UnauthorizedException();
        }

        const user = await this.UserModel.findOne({
            _id: payload.userId,
            statusId: {
                $ne: status.DELETED
            }
        })

        if (!user) {
            throw new UnauthorizedException();
        }

        if (user.statusId === status.PENDING) {
            throw new UnauthorizedException("You need to confirm your email first");
        }
        request['user'] = user;
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}