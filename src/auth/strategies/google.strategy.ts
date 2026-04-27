import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions, VerifyCallback } from "passport-google-oauth20";
import googleOauthConfig from "../config/google-oauth.config";
import type { ConfigType } from "@nestjs/config";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){ 
    constructor(
        @Inject(googleOauthConfig.KEY) private googleConfiguration:
        ConfigType<typeof googleOauthConfig>
    ){
        const options: StrategyOptions = {
            clientID: googleConfiguration.clientID!,
            clientSecret: googleConfiguration.clientSecret!,
            callbackURL: googleConfiguration.callbackURL,
            scope: ['email', 'profile'],
        };
        super(options);
    }

    async validate(accessToken:string, refreshToken:string, profile:any,
        done:VerifyCallback){
            console.log({profile});
    }
}