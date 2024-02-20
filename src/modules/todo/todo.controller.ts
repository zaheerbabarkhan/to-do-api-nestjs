import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.todoService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
  //   return this.todoService.update(+id, updateTodoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.todoService.remove(+id);
  // }
}
