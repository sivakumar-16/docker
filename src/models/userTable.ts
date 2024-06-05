import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserBook } from "./userBookTable";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: "user" })
  role: string;

  @OneToMany(() => UserBook, (userBook) => userBook.username)
  userBooks: UserBook[];
}
