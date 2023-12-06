import express from "express";
import dataController from "../controllers/dataController";

const router = express.Router();

router.get("/data", dataController.getAllData);
router.get("/data/:id", dataController.getDataById);
router.post("/data", dataController.createData);
router.put("/data/:id", dataController.updateData);
router.delete("/data/:id", dataController.deleteData);

export default router;
