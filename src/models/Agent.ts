import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User";

@Entity("agents")
export class Agent {
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column()
    photo?: string;

    @Column()
    specialty?: string;

    @Column()
    created_at!: Date;
  
    @Column()
    updated_at!: Date;

    @OneToOne(() => User, user => user.agent)
    @JoinColumn({ name: "user_id" })
    user!: User;
}
