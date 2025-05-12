import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'metrics', timestamps: false, schema: 'public' })
export class Metric extends Model {
  @Column({ type: DataType.DATE, primaryKey: true, field: 'ts' })
  ts: Date;

  @Column({ type: DataType.DECIMAL, field: 'value' })
  value: number;
} 