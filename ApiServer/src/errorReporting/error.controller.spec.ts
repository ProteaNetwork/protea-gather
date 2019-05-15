import { Test, TestingModule } from '@nestjs/testing';
import { ErrorController } from './error.controller';

describe('Error Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ErrorController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ErrorController = module.get<ErrorController>(ErrorController);
    expect(controller).toBeDefined();
  });
});
