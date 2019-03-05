import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachment.service';

describe('AttachmentsService', () => {
  let service: AttachmentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttachmentsService],
    }).compile();
    service = module.get<AttachmentsService>(AttachmentsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
