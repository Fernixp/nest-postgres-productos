import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('v1/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  @Auth()
  seedDb() {
    return this.seedService.runSeed();
  }
}
