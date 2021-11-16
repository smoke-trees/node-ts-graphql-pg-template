import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

// for soft write options
class BaseEntity {
  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;

  constructor (createdDate = new Date(), updatedDate = new Date()) {
    this.createdDate = createdDate
    this.updatedDate = updatedDate
  }
}

export default BaseEntity
