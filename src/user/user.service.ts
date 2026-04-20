import { Injectable } from '@nestjs/common';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { s3 } from "src/s3/s3.service";
import { Express } from "express";
@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
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
  private bucket = "images";

  async upload(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return {
      message: "Upload successful",
      fileName,
      url: `http://localhost:9000/${this.bucket}/${fileName}`,
    };
  }
  
}
