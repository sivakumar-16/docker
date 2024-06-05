import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1717088000901 implements MigrationInterface {
    name = 'CreateTable1717088000901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("ID" SERIAL NOT NULL, "bookname" character varying NOT NULL, CONSTRAINT "PK_efd4fe0163bbbc48cfc9af9d895" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "user_book" ("UBID" SERIAL NOT NULL, "startdate" character varying NOT NULL, "enddate" character varying NOT NULL, "usernameID" integer, "booknameID" integer, CONSTRAINT "PK_fdfe121d168b935a3f53d986404" PRIMARY KEY ("UBID"))`);
        await queryRunner.query(`CREATE TABLE "user" ("ID" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "PK_f0eace201126c1c8be2ae32fd22" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_5512c44fe6663e8f1a94e01138d" FOREIGN KEY ("usernameID") REFERENCES "user"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_4077a975d25c90310520de0b90f" FOREIGN KEY ("booknameID") REFERENCES "book"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_4077a975d25c90310520de0b90f"`);
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_5512c44fe6663e8f1a94e01138d"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_book"`);
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
