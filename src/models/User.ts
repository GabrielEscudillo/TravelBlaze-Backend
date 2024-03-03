import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role";
import { Agent } from "./Agent";
import { Appointment } from "./Appointment";
import { Booking } from "./Booking";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column()
    last_name!: string;

    @Column()
    photo?: string;

    @Column()
    address!: string;

    @Column()
    email!: string;

    @Column({select: false})
    password_hash!: string

    @Column()
    phone_number!: number;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn ({name: "role_id"})
    role!: Role;

    @OneToOne(() => Agent, (agents) => agents.user)
    agent?: Agent;
    
    @OneToMany(() => Appointment, (appointment) => appointment.user)
    customerAppointments!: Appointment[];

    @OneToMany(() => Booking, booking => booking.user)
    bookings!: Booking[];
}