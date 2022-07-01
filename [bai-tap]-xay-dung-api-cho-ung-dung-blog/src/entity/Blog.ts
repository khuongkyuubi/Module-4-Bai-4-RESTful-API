import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  public readonly id: number;


  @Column({ type: "varchar" })
  public tittle: string;

  @Column({ type: "varchar", default: "Admin" })
  public author: string;

  @Column({ type: "varchar" })
  public content: string;

}