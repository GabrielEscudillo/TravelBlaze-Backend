import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Appointment } from "./Appointment";

@Entity("services")
export class Service {
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column()
    service_name!: string;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @OneToMany(() => Appointment, (appointment) => appointment.service)
    appointments!: Appointment[];
}
