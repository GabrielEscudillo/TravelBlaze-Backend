import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBookings1709471120413 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bookings",
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
                        name: "date_of_purchase",
                        type: "date",
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "flight_id",
                        type: "int",
                        isNullable: true,
                    },                 
                    {
                        name: "hotel_id",
                        type: "int",
                        isNullable: true,
                    },   
                    {
                        name: "cruise_id",
                        type: "int",
                        isNullable: true,
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
                    },
                    {
                      columnNames: ["flight_id"],
                      referencedTableName: "flights",
                      referencedColumnNames: ["id"],
                      onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["hotel_id"],
                        referencedTableName: "hotels",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["cruise_id"],
                        referencedTableName: "cruises",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                  ],
                }),
            true
           
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("bookings");
     }
  }