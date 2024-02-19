import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/User.schema';
import { Model } from 'mongoose';
import config from 'src/config/config';
import * as bcrypt from "bcrypt";
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from './dto/user-login.dto';
import status from 'src/constants/status';
import { Payload } from '../../types/jwt.types';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { email, firstName, lastName, password } = createUserDto;
    const user = await this.UserModel.findOne({
      email: createUserDto.email,
    })
    if (user) {
      throw new HttpException("Email already registered", HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await bcrypt.hash(password, config.BCRYPT.SALT_ROUNDS);
    const newUser = await this.UserModel.create({
      email,
      firstName,
      lastName,
      password: passwordHash
    });
    const token = this.jwtService.sign({
      userId: newUser._id
    })
    let emailSuccessMessage = "Confirmation email sent successfully.";
    try {
      if (config.NODE_ENV !== "test") {
        await this.mailService.confirmationEmail(newUser.email, token);
      }
    } catch (error) {
      console.log(error);
      emailSuccessMessage = "Confirmation email failed. Please provide a valid email or contact support.";
    }

    return {
      user: newUser,
      message: emailSuccessMessage
    };
  }

  async login(userLoginDTO: UserLoginDTO) {
    const { email, password } = userLoginDTO;
    const user = await this.UserModel.findOne({
      email,
      statusId: {
        $ne: status.DELETED
      }
    })

    if (!user) {
      throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
    }

    if (user.statusId === status.PENDING) {
      throw new HttpException("Confirm your email please", HttpStatus.BAD_REQUEST)
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException("Invalid credentials.", HttpStatus.BAD_REQUEST,);
    }

    const token = this.jwtService.sign({
      userId: user._id
    }, {
      expiresIn: config.JWT.EXPIRY
    })
    return {
      message: "Login successful",
      token,
    };

  }

  async confirmEmail(token: string) {
    let payload: Payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (error) {
      console.log(error);
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED,);
    }
    const user = await this.UserModel.findOne({
      _id: payload.userId,
      statusId: {
        $ne: status.DELETED
      }
    })

    if (!user) {
      console.log("not found");
      throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
    }

    if (user.statusId === status.ACTIVE) {
      throw new HttpException("Email confirmed already", HttpStatus.BAD_REQUEST)
    }

    user.statusId = status.ACTIVE;
    await user.save();
    return {
      message: "Email confirmed successfully"
    }

  }

  async logout(userId: string, token: string) {
    const jwtData = this.jwtService.decode(token);
    const expiryTimeLeft = Math.floor(Math.abs( jwtData.exp - (Date.now() /1000)));
    await this.redisService.storeUserToken(token, userId, expiryTimeLeft);
    return {
        message: "User logged out",
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
