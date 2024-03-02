import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRoles1709394873303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "roles",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "role_name",
                type: "enum",
                enum: ["customer", "agent", "super_admin"],
                default: "'customer'",
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
              },
            ],
          }),
          true
        );
      }

      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("roles");
     }
  }