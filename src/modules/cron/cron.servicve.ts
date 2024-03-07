import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import status from '../../constants/status';
import { User, UserDocument } from '../../schemas/User.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronJobsService {
    constructor(@InjectModel(User.name) private readonly User: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService) { }

    @Cron("0 0 * * *")
    async openForBusiness() {
        const todayDate = new Date();
        todayDate.setUTCHours(0, 0, 0, 0);
        const nextDay = new Date(todayDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const pipeline = [
            {
                $match: {
                    statusId: { $ne: status.DELETED }
                }
            },
            {
                $lookup: {
                    from: "todos",
                    localField: "_id",
                    foreignField: "userId",
                    as: "todos",
                    pipeline: [
                        {
                            $match: {
                                statusId: status.PENDING,
                                dueDate: {
                                    $gte: todayDate,
                                    $lt: nextDay
                                }
                            }
                        },
                    ]
                }
            },
        ];
        const pendingTodosUsers = await this.User.aggregate(pipeline)
        for (const user of pendingTodosUsers) {
            if (user.todos.length) {
                const token = this.jwtService.sign({
                    userId: user._id
                  });
                  try {
                    console.log("Sending reminder message to user: ", user.email);
                    await this.mailService.reminderEmail(user.email, token, `&status_id=${status.PENDING}&dueDate=${new Date()}`)
                  } catch (error) {
                    console.log("error orccured while sending reminder email", error);
                  }
            }
        }
    }
}