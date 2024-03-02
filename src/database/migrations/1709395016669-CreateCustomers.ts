import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomers1709395016669 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "customers",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "last_name",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "address",
                        type: "varchar",
                        length: "255",
                    },
                     {
                        name: "phone_number",
                        type: "int",
                        length: "20",
                        isUnique: true,
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
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }
                ]
    
            }),
            true
           
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("customers");
     }
  }
