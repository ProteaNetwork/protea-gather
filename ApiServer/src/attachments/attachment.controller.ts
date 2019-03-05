import { Controller, Get, Param, Res } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { Response } from 'express';
import { Stream } from 'stream';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) { }

  @Get(':id')
  async getFile(@Param('id') attachmentId: string): Promise<Buffer> {
    const result = await this.attachmentService.getFile(attachmentId);
    return result;
  }

  @Get(':id/stream')
  async getFileStream(@Res() res: Response, @Param('id') attachmentId: string): Promise<Stream> {
    const contentType = await this.attachmentService.getFileContentType(attachmentId);
    res.set('Content-Type', contentType);
    const readStream = this.attachmentService.getFileStream(attachmentId);
    return readStream.pipe(res);
  }
}
