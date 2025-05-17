import express from "express";
import { CustomOrderController } from "../controllers/customOrderController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Customer routes
router.post(
  "/",
  authenticate,
  authorize(['customer']), // Add this
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

// Shop owner routes
router.get(
  "/",
  authenticate,
  authorize(['shopowner']), // Add this
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
  authorize(['customer']), // Or appropriate roles
  CustomOrderController.getOrderById
);


router.get(
  '/:id/receipt',
  authenticate,
  CustomOrderController.getOrderReceipt
);


export default router;