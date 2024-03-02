import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAgents1709394982330 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "agents",
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
                        name: "photo",
                        type: "varchar",
                        length: "500",
                        default: "'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "specialty",
                        type: "varchar",
                        length: "100",                        
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
        await queryRunner.dropTable("agents");
     }
  }