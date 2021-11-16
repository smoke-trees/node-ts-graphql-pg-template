import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import BaseEntity from './base'
import { UserInterface } from '../../@types/user'

@Entity({ name: 'users' })
export default class UserEntity extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'email',
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    name: 'username',
    unique: true,
    nullable: false
  })
  username: string;

  @Column({ name: 'password', length: 100, nullable: false })
  password: string;

  // email/otp confirmation of user
  @Column({ name: 'confirmed', default: false, nullable: false, type: 'boolean' })
  confirmed: boolean;

  // admin disabled profile
  @Column({ name: 'is_disabled', default: false, nullable: false, type: 'boolean' })
  isDisabled: boolean;

  constructor (user: UserInterface) {
    super()
    if (user) {
      const { email, username, password, confirmed, isDisabled } = user
      this.username = username
      this.email = email
      this.password = password
      this.confirmed = confirmed
      this.isDisabled = isDisabled
    }
  }
}
