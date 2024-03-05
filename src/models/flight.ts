import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Booking } from "./Booking";

@Entity("flights")
export class Flight {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    airline!: string;

    @Column()
    flight_number!: string;

    @Column()
    departure!: string;

    @Column()
    destination!: string;

    @Column({ type: "date" })
    date_of_departure!: string;

    @Column({ type: "date" })
    date_of_return!: string;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @OneToOne(() => Booking, (booking) => booking.flight)
    @JoinColumn({ name: "booking_id" })
    booking!: Booking
}
