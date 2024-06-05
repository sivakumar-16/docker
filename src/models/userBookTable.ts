import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import {User} from './userTable';
import { Book} from './bookTable';

@Entity()
export class UserBook extends BaseEntity{
  @PrimaryGeneratedColumn()
  UBID: number;

  @ManyToOne(() => User, user => user.userBooks)
  username: User;

  @ManyToOne(() => Book, book => book.userBooks)
  bookname: Book;
  
  @Column()
  startdate:string;

  @Column()
  enddate:string;




  
}
