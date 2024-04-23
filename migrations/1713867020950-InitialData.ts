import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialData1713867020950 implements MigrationInterface {
  private readonly logger = new Logger(InitialData1713867020950.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Up');
    await queryRunner.query(
      `INSERT INTO stacks(name) VALUES ('JavaScript'), ('TypeScript'), ('NodeJS'), ('ExpressJS'), ('NestJS'), ('DenoJS'), ('React'), ('Vue'), ('Angular'), ('NextJS'), ('NuxtJS'), ('RemixJS'), ('Svelte'), ('Java'), ('Spring'), ('Python'), ('Django'), ('C'), ('C#'), ('C++'), ('.NET'), ('PHP'), ('Ruby'), ('ReactNative'), ('Flutter'), ('Swift'), ('Kotlin'), ('AWS'), ('Azure'), ('GCP'), ('NCP'), ('Unity'), ('Unreal'), ('Figma'), ('Zeplin'), ('XD'), ('Sketch'), ('Maya'), ('3dsMax'), ('Blender'), ('MySQL'), ('PostgreSQL'), ('OracleDB'), ('MariaDB'), ('MsSQL'), ('MongoDB');`,
    );
    await queryRunner.query(
      `INSERT INTO positions(name) VALUES ('FrontEnd'), ('BackEnd'), ('DataEngineer'), ('Mobile'), ('Game Client'), ('Game Server'), ('Design'), ('Art')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Down');
    await queryRunner.query(`TRUNCATE TABLE stacks, positions`);
  }
}
