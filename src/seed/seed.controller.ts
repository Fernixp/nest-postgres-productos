import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('v1/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  seedDb() {
    return this.seedService.runSeed();
  }
}
