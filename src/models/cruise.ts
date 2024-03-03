import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Booking } from "./Booking";

@Entity("cruises")
export class Cruise {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    cruise_line!: string;

    @Column()
    cabin!: string;

    @Column()
    route!: string;

    @Column()
    date_of_departure!: Date;

    @Column()
    date_of_return!: Date;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @OneToOne(() => Booking, (booking) => booking.cruise)
    @JoinColumn({ name: "booking_id" })
    booking!: Booking
}
