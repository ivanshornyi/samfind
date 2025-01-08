import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { UserAuthType, UserRole, UserStatus } from "../types/user"; 

import { v4 as uuidv4 } from "uuid";
import { IsEnum } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // @Column()
  // logo: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @IsEnum(UserRole)
  @Column()
  role: UserRole;

  @IsEnum(UserAuthType)
  @Column()
  authType: UserAuthType;

  @Column({ nullable: true })
  refreshToken: string;

  @IsEnum(UserStatus)
  @Column()
  status: UserStatus;
   
  @Column({ nullable: true })
  resetCode: string;
 
  @Column({ type: "bigint", nullable: true })
  resetCodeExpiresAt: number;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}