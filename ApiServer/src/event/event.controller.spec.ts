import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';

describe('Event Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [EventController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: EventController = module.get<EventController>(EventController);
    expect(controller).toBeDefined();
  });
});
