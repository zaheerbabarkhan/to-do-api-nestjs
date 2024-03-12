import { Type } from "class-transformer";
import { IsDate, IsDefined, IsOptional, IsString, Length } from "class-validator";

export class CreateTodoDto {
    @IsString()
    @IsDefined()
    @Length(2,50)
    title: string

    @Type(() => Date)
    @IsDate()
    @IsDefined()
    dueDate: Date

    @IsOptional()
    @IsString()
    description?: string
}
