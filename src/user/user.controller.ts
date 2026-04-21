
/*import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  constructor(private readonly uploadService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}*/
import { BadRequestException, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly uploadService: UserService) {}
  /*
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }
  /*/
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 2 * 1024 * 1024 } }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const userId=1
    if(!file){
      throw new BadRequestException("No file uploaded")
    }
    if(!file.mimetype.startsWith("image/")){
      throw new BadRequestException("Only pictures are allowed")
    }
    return this.uploadService.upload(file,userId);
  }
  @Get("images")
  getImages(){
    const userId=1
    return this.uploadService.getImages(userId)
  }
  @Get("image-count")
  getImageCount(){
    const userId=1
    return this.uploadService.getImageCount(userId)
  }
  @Post("profile/:id")
  setProfile(@Param("id",ParseIntPipe) id:number){
    const userId=1
    return this.uploadService.setProfile(userId,id)
  }
  @Delete(":id")
  deletImag(@Param("id",ParseIntPipe) id:number){
    const userId=1
    return this.uploadService.deletImag(id,userId)
  }

  
}