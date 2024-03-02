import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrders1709395058634 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "Orders",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "service_name",
                        type: "varchar",
                        length: "100",                        
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    },
                ],
                }),
            true
           
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("services");
     }
  }
