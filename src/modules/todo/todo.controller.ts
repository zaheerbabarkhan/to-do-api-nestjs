import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Request, UseGuards, Put, Query, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { ParseObjectIdPipe } from './pipes/objectId.pipe';
import { AllTodoDTO } from './dto/all-todo.dto';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }


  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createTodoDto: CreateTodoDto, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req) {
    return this.todoService.create(createTodoDto, files, req.user._id);
  }

  @Get()
  findAll(@Request() req, @Query() allTodoDTO: AllTodoDTO) {
    const { sortBy, sortDir, attributes } = allTodoDTO;
    const filters = this.todoService.queryClause(allTodoDTO, req.user._id)
    return this.todoService.findAll(filters, sortBy, sortDir, attributes);
  }


  @Get("count")
  totalCount(@Request() req) {
    return this.todoService.totalCount(req.user._id)
  }

  @Get("per-day-count")
  async perDayCount(@Request() req) {
    return this.todoService.perDayCount(req.user._id)
  }

  @Get("overdue-count")
  async overdueCount(@Request() req) {
    return this.todoService.overdueCount(req.user._id)
  }

  @Get("avg-per-day")
  async avgCompletedPerDay(@Request() req) {
    return this.todoService.avgCompletedPerDay(req.user._id)
  }

  @Get("max-per-day")
  async maxCompletedPerDay(@Request() req) {
    return this.todoService.maxCompletedPerDay(req.user._id)
  }
  
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.todoService.findOne(id, req.user._id);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(@Body() updateTodoDto: UpdateTodoDto, @Param('id', ParseObjectIdPipe) id: string, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req) {
    return this.todoService.update(id, updateTodoDto, req.user._id, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string, @Request() req) {
    return this.todoService.remove(id, req.user._id);
  }


}
