import { Controller, Get, Post, Body, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { User } from '../../schemas/User.schema';
import { AuthGuard } from '../auth/auth.guard';

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

  @UseGuards(AuthGuard)
  @Post("logout")
  logout(@Request() req){
    const token = req.headers.authorization.split(" ")[1];
    return this.userService.logout(req.user._id, token);
  }
  
}
