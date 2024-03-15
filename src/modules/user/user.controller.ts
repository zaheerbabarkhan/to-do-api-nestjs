import { Controller, Get, Post, Body, Query, Request, UseGuards, Req, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { User, UserDocument } from '../../schemas/User.schema';
import { AuthGuard } from '../auth/auth.guard';
import { GoogleOAuthGuard } from '../auth/google.guard';
import { GithubOAuthGuard } from '../auth/github.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {  
    return this.userService.create(createUserDto);
  }

  @Post("login")
  login(@Body() userLoginDTO: UserLoginDTO) {
    return this.userService.login(userLoginDTO)
  }


  @Get("confirm-email")
  confirmEmail(@Query("token") token: string){
    return this.userService.confirmEmail(token);
  }

  @Post("forgot-password")
  forgotPassword(@Request() req) {
    if (!req || !req.body || !req.body.email) {
      throw new HttpException("Invalid credentials1", HttpStatus.BAD_REQUEST)
    }
    return this.userService.forgotPassword(req.body.email)
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  logout(@Request() req){
    const token = req.headers.authorization.split(" ")[1];
    return this.userService.logout(req.user._id, token);
  }

  
  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    if (!req.user) {
      return 'No user from google';
    }
    return this.userService.oAuthLogin(req.user as UserDocument);
  }

  @Get("github")
  @UseGuards(GithubOAuthGuard)
  async githubAuth(@Request() req) {}

  @Get('github-redirect')
  @UseGuards(GithubOAuthGuard)
  githubAuthRedirect(@Request() req) {
    if (!req.user) {
      return 'No user from google';
    }
    return this.userService.oAuthLogin(req.user as UserDocument);
  }
}
