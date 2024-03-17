import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';
import { Flight } from './Flight';
import { Hotel } from './Hotel';
import { Cruise } from './Cruise';


@Entity("bookings")
export class Booking {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "date" })
    date_of_purchase!: Date;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    @Column()
    user_id!: number;

    @Column({ nullable: true }) 
    flight_id?: number;

    @Column({ nullable: true }) 
    cruise_id?: number;

    @Column({ nullable: true }) 
    hotel_id?: number;

    @Column()
    created_at!: Date;
  
    @Column()
    updated_at!: Date;

    @ManyToOne(() => User, user => user.bookings)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @OneToOne(() => Flight, (flight) => flight.booking)
    flight!: Flight;

    @OneToOne(() => Hotel, (hotel) => hotel.booking)
    hotel!: Hotel;

    @OneToOne(() => Cruise, (cruise) => cruise.booking)
    cruise!: Cruise;
}
