import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import config from './config';
import { User, UserDocument } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountType } from 'src/types/user.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(@InjectModel(User.name) private readonly User: Model<UserDocument>) {
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

            let user = await this.User.findOne({
                email,
            })
            if (!user) {
                user = await this.User.create({
                    email,
                    firstName,
                    lastName,
                    accountType: AccountType.SOCIAL
                })
            }
            done(null, user);
        }
    }
}