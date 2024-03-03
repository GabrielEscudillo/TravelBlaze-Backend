import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateHotels1709471379928 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "hotels",
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
                        name: "hotel_name",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "address",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "guests",
                        type: "varchar",
                        length: "100",                        
                     },
                     {
                        name: "check_in_date",
                        type: "date",
                    },
                    {
                        name: "check_out_date",
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
        await queryRunner.dropTable("hotels");
     }
  }