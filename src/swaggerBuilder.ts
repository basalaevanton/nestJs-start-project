import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Start-project')
  .setDescription('Документация REST API')
  .setVersion(JSON.stringify(process.env.npm_package_version))
  .addTag('')
  
  .build();
