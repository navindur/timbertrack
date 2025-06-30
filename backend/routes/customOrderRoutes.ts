//router for hanlde custom orders in owner and customer side 
import express from "express";
import { CustomOrderController } from "../controllers/customOrderController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(['customer']), 
  upload.single('image'),
  CustomOrderController.createOrder
);

router.get(
  "/my/:customerId",
  authenticate,
  CustomOrderController.getMyOrders
);

router.put(
  "/:id/mark-paid",
  authenticate,
  CustomOrderController.markAsPaid
);

router.get(
  "/",
  authenticate,
  authorize(['shopowner']), 
  CustomOrderController.getAllOrders
);

router.put(
  "/:id/accept",
  authenticate,
  authorize(['shopowner']),
  CustomOrderController.acceptOrder
);

router.put(
  "/:id/reject",
  authenticate,
  authorize(['shopowner']),
  CustomOrderController.rejectOrder
);

router.put(
  "/:id/update-status",
  authenticate,
  authorize(['shopowner']),
  CustomOrderController.updateProductionStatus
);

router.get(
  '/:id',
  authenticate,
  authorize(['customer']), 
  CustomOrderController.getOrderById
);


router.get(
  '/:id/receipt',
  authenticate,
  CustomOrderController.getOrderReceipt
);


export default router;