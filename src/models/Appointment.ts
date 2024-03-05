import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { User } from "./User";
import { Agent } from "./Agent";
import { Service } from "./Service";

@Entity("appointments")
@Unique(['agent', 'date', 'time'])
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  date!: Date;

  @Column()
  user_id!: number;

  @Column()
  agent_id!: number;

  @Column()
  service_id!: number;

  @Column({ type: "time" })
  time!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.role)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;

  @ManyToOne(() => Agent, (agent) => agent.user)
  @JoinColumn({ name: "agent_id", referencedColumnName: "id" })
  agent!: Agent;

  @ManyToOne(() => Service, (service) => service.appointments)
  @JoinColumn({ name: "service_id", referencedColumnName: "id" })
  service!: Service;
}

