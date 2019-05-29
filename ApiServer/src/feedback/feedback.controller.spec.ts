import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';

describe('Error Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [FeedbackController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: FeedbackController = module.get<FeedbackController>(FeedbackController);
    expect(controller).toBeDefined();
  });
});
