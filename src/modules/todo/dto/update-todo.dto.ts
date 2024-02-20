import { Transform, Type } from "class-transformer"
import { IsString, IsDefined, Length, IsDate, IsOptional, IsBoolean } from "class-validator"

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    @Length(2,50)
    title: string

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    dueDate: Date

    @IsOptional()
    @IsString()
    description: string

    @Transform(({ value }) => {  
        return [true, 'true', 1, '1'].indexOf(value) > -1;  
      })  
    @IsOptional()
    @IsBoolean()
    markCompleted: boolean

}
