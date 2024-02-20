import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Request, UseGuards, Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { ParseObjectIdPipe } from './pipes/objectId.pipe';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}


  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createTodoDto: CreateTodoDto, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req) {
    return this.todoService.create(createTodoDto, files, req.user._id);
  }

  // @Get()
  // findAll() {
  //   return this.todoService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.todoService.findOne(id, req.user._id);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(@Body() updateTodoDto: UpdateTodoDto, @Param('id', ParseObjectIdPipe) id: string,@UploadedFiles() files: Array<Express.Multer.File>, @Request() req) {
    return this.todoService.update(id, updateTodoDto, req.user._id, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string, @Request() req) {
    return this.todoService.remove(id, req.user._id);
  }
}
