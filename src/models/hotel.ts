import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Booking } from "./Booking";

@Entity("hotels")
export class Hotel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    hotel_name!: string;

    @Column()
    address!: string;

    @Column()
    guests!: number;

    @Column({ type: "date" })
    check_in_date!: Date;

    @Column({ type: "date" })
    check_out_date!: Date;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @OneToOne(() => Booking, (booking) => booking.hotel)
    @JoinColumn({ name: "booking_id" })
    booking!: Booking
}
