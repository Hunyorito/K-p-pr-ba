import { BadRequestException, Injectable } from '@nestjs/common';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { s3 } from "src/s3/s3.service";
import { Express } from "express";

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly db:PrismaService) {}
  /*
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
  /*/
  private bucket = "test-image";
  async getImages(userId:number){
    console.log("teszt get images")
    const images=await this.db.image.findMany({
      where:{
        userId,
        deleted: false
      }
      
    })
    const val=images.map(img=>({
      id:img.id,
      IsProfile:img.IsProfile,
      url:`http://localhost:9000/${this.bucket}/${img.key}`

    }))
    console.log(val)
    return images.map(img=>({
      id:img.id,
      IsProfile:img.IsProfile,
      url:`http://localhost:9000/${this.bucket}/${img.key}`

    }))
  }
  async getImageCount(userId:number){
    const count=await this.db.image.count({
      where:{
        userId,
        deleted: false
      }
    })
    return count
  }
  async setProfile(userId:number, id:number){
    await this.db.image.updateMany({
      where:{userId},
      data:{IsProfile:false}
    });
    return this.db.image.update({
      where: {id:id},
      data:{IsProfile:true},
    })
  }

  async upload(file: Express.Multer.File, userId:number) {
    const Max_Imag=5;
    console.log("Edg 1")
    const count=await this.db.image.count({
      where:{
        userId,
        deleted: false
      }
    })
    if(count>=Max_Imag){
      throw new BadRequestException("Reached maximum image limit")

    }
  const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const key = `${Date.now()}-${safeName}`;
  const url = `http://localhost:9000/${this.bucket}/${key}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const image=await this.db.image.create({
      data:{
        userId,
        key,
        url,
        IsProfile: false,
        
      }
    })

    return {
      message: "Upload successful",
      id:image.id,
      url: url,
    };
  }
  async deletImag(id:number,userId:number){
    
    return await this.db.image.update({
      where:{id:id},
      data:{deleted:true}
    })
  }
}
  /*
  async deleteImage(id:number){
    return await this.db.image.update({
      where:{id:id},
      data:{deleted:true }
    })
  }
  /*/

