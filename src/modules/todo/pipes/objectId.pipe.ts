import { BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Types } from "mongoose"
@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(value: string) {
        const validObjectId = Types.ObjectId.isValid(value);

        if (!validObjectId) {
            throw new NotFoundException('Todo not found 1');
        }

        return value

    }
}