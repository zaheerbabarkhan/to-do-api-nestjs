import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import config from './config';
import { User, UserDocument } from '../schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountType } from '../types/user.types';
import status from 'src/constants/status';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(@InjectModel(User.name) private readonly User: Model<UserDocument>,
    private readonly userService: UserService) {
        super({
            clientID: config.OAUTH.GOOGLE_CLIENT_ID,
            clientSecret: config.OAUTH.GOOGLE_CLIENT_SECRET,
            callbackURL: config.OAUTH.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        if (profile.emails?.length) {
            const email = profile.emails[0].value;
            const firstName = profile.name?.givenName as string;
            const lastName = profile.name?.familyName as string;

            const user = await this.userService.createSocialUser({
                email,
                firstName,
                lastName
            });
            done(null, user);
        }
    }
}