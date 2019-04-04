import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/common";
import Express from 'express';


export enum FileOptions {
  PICTURE =  'PICTURE',
  PDF = 'PDF'
}

export interface FileInterceptOption {
  name: string;
  maxCount: number;
  type: FileOptions
}

export const FileFieldsInterceptorHelper = (fileOptions: FileInterceptOption[]) =>
  FileFieldsInterceptor(
    fileOptions.map(option => ({name: option.name, maxCount: option.maxCount})),
    {
      fileFilter: (req: Express.Request, file, cb) => {
        const acceptMimeTypes = fileOptions
        .filter(option => option.name === file.fieldname)
          .map(targetOption => {
            switch (targetOption.type) {
              case FileOptions.PDF:
                return ['application/pdf'];
              case FileOptions.PICTURE:
                return ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
            }
          })[0];

        // const acceptMimeTypes = file.fieldname === 'markushStructure' ?
        //   ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'] : ['application/pdf'];

        if (acceptMimeTypes.indexOf(file.mimetype) === -1) return cb(new Error('Extension not allowed'), false);
        return cb(null, true);
      }
    }
  )

export const FileInterceptorHelper = (fileOption: FileInterceptOption) =>
  FileInterceptor(
    fileOption.name,
    {
      fileFilter: (req: Express.Request, file, cb) => {
        let acceptMimeTypes;
        switch (fileOption.type) {
          case FileOptions.PDF:
            acceptMimeTypes = ['application/pdf'];
          case FileOptions.PICTURE:
            acceptMimeTypes = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
        }

        if (acceptMimeTypes.indexOf(file.mimetype) === -1) return cb(new Error('Extension not allowed'), false);
        return cb(null, true);
      }
    }
  )
