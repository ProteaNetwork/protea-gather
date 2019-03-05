import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentController } from './attachment.controller';

describe('Attachments Controller', () => {
  let attachmentController: AttachmentController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AttachmentController],
    }).compile();
    attachmentController = module.get<AttachmentController>(AttachmentController);
  });
  it('should be defined', () => {
    expect(attachmentController).toBeDefined();
  });
});
