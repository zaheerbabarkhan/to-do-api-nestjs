import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile} from "passport-github2";

import config from './config';
import { User, UserDocument } from '../schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountType } from '../types/user.types';
import { VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(@InjectModel(User.name) private readonly User: Model<UserDocument>,
    private readonly userService: UserService) {
        super({
            clientID: config.OAUTH.GITHUB_CLIENT_ID,
            clientSecret: config.OAUTH.GITHUB_CLIENT_SECRET,
            callbackURL: config.OAUTH.GITHUB_CALLBACK_URL,
            scope: ['user:email'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<any> {
        if (profile.emails?.length) {
            const email = profile.emails[0].value;
            const splitName = profile.displayName.trim().split(" ");
            const firstName = splitName[0];
            const lastName = splitName[splitName.length - 1];

            const user = await this.userService.createSocialUser({
                email,
                firstName,
                lastName
            });
            done(null, user);
        }
    }
}