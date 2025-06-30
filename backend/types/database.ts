import { RowDataPacket } from 'mysql2';

export interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  material?: string;
}