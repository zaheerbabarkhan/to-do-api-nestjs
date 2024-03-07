import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { SortOrder } from "mongoose";
import status from "../../../constants/status";

export class AllTodoDTO {
    @IsString()
    @IsOptional()
    query: string

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @IsIn([status.PENDING, status.COMPLETED])
    statusId: number

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    dueDate: Date

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    completedAt: Date

    @IsString()
    @IsOptional()
    @IsIn(["title", "completedAt", "dueDate", "createdAt"])
    sortBy: string

    @IsString()
    @IsOptional()
    @IsIn(["asc", "desc"])
    sortDir: SortOrder

    
    @IsString()
    @IsOptional()
    attributes: string
}