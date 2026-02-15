import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';



@Controller('v1/files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path)
  }
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1000000 }, //10 mbs
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) {
      throw new BadRequestException('Debes asegurarte de que file, sea una imagen.!')
    }

    const base_url = this.configService.get('HOST_API');
    const secureUrl = `${base_url}/v1/files/product/${file.filename}`

    return {
      secureUrl: secureUrl
    }
  }

}
