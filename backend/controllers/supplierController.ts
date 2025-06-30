//owner side supplier controller methods 
import { Request, Response } from 'express';
import * as supplierService from '../services/supplierService';

export const getSuppliers = async (_: Request, res: Response) => {
  const suppliers = await supplierService.getAllSuppliers();
  res.json(suppliers);
};

export const createSupplier = async (req: Request, res: Response) => {
  await supplierService.addSupplier(req.body);
  res.status(201).json({ message: 'Supplier added successfully' });
};

export const removeSupplier = async (req: Request, res: Response) => {
  await supplierService.deleteSupplier(Number(req.params.id));
  res.json({ message: 'Supplier deleted successfully' });
};

export const editSupplier = async (req: Request, res: Response) => {
  await supplierService.updateSupplier(Number(req.params.id), req.body);
  res.json({ message: 'Supplier updated successfully' });
};
