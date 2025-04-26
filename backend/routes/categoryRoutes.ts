// routes/categoryRoutes.ts
import express from 'express';
import {
  getDiningProducts,
  getLivingProducts,
  getBedroomProducts,
  getCategories,
  getOfficeProducts,
  handleCategory
} from '../controllers/categoryController';

const router = express.Router();

router.get('/', getCategories);
router.get('/:category', handleCategory);
router.get('/dining', getDiningProducts);
router.get('/living', getLivingProducts);
router.get('/bedroom', getBedroomProducts);
router.get('/office', getOfficeProducts);

export default router;