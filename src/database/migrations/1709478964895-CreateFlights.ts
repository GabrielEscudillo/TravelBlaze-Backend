import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFlights1709478964895 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "flights",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "booking_id",
                        type: "int",
                    },
                    {
                        name: "airline",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "flight_number",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "departure",
                        type: "varchar",
                        length: "255",
                    },
                     {
                        name: "destination",
                        type: "int",
                        length: "20",
                        isUnique: true,
                    },
                    {
                        name: "date_of_departure",
                        type: "date",
                    },
                    {
                        name: "date_of_return",
                        type: "date",
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
                        columnNames: ["booking_id"],
                        referencedTableName: "bookings",
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
