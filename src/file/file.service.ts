import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { FileType } from './types';
import { filePath } from './constants';

@Injectable()
export class FileService {
  createFile(fileType: FileType, file: Express.Multer.File): string {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuid.v4()}.${fileExtension}`;
      const typedFilePath = path.resolve(filePath, fileType);

      if (!fs.existsSync(typedFilePath)) {
        fs.mkdirSync(typedFilePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(typedFilePath, fileName), file.buffer);

      return `${fileType}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  removeFile(fileName: string): void {
    try {
      if (!fileName) {
        return;
      }
      const avatarPath = path.resolve(filePath, fileName);

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
