import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1709394882167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "role_id",
                        type: "int",
                        default: 1
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                    },
                    {
                        name: "password_hash",
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
                foreignKeys: [  
                    {
                        columnNames: ["role_id"],
                        referencedTableName: "roles",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }
                ]
    
            }),
            true
           
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
     }
  }