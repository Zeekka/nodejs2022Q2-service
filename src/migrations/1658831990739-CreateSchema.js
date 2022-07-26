const {MigrationInterface, QueryRunner} = require("typeorm");

module.exports = class CreateSchema1658831990739 {
  name = 'CreateSchema1658831990739';

  async up(queryRunner) {
    await queryRunner.query(`CREATE TABLE "user"
                             (
                                 "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "login"     character varying NOT NULL,
                                 "password"  character varying NOT NULL,
                                 "version"   integer           NOT NULL,
                                 "createdAt" integer           NOT NULL,
                                 "updatedAt" integer           NOT NULL,
                                 CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"),
                                 CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "artist"
                             (
                                 "id"     uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "name"   character varying NOT NULL,
                                 "grammy" boolean           NOT NULL DEFAULT false,
                                 CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "album"
                             (
                                 "id"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "name"     character varying NOT NULL,
                                 "year"     integer           NOT NULL,
                                 "artistId" uuid,
                                 CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "track"
                             (
                                 "id"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "name"     character varying NOT NULL,
                                 "artistId" uuid,
                                 "albumId"  uuid,
                                 "duration" integer           NOT NULL,
                                 CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "favourites_entity"
                             (
                                 "entityId"   character varying                            NOT NULL,
                                 "entityType" "public"."favourites_entity_entitytype_enum" NOT NULL,
                                 CONSTRAINT "PK_2eea0e261ac9f597ee3e113bdb7" PRIMARY KEY ("entityId")
                             )`);
    await queryRunner.query(`ALTER TABLE "album"
        ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "track"
        ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "track"
        ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`);
    await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`);
    await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"`);
    await queryRunner.query(`DROP TABLE "favourites_entity"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
