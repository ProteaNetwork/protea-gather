import { Test, TestingModule } from '@nestjs/testing';
import { CommunityController } from './community.controller';

describe('Community Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CommunityController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: CommunityController = module.get<CommunityController>(CommunityController);
    expect(controller).toBeDefined();
  });
});
