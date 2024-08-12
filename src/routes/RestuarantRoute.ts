import express  from "express";
import { param } from "express-validator";
import MyRestuarantController from "../controllers/MyRestuarantController";
import RestuarantController from "../controllers/RestuarantController";

const router = express.Router();

router.get(
    "/search/:city", 
    param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
    RestuarantController.searchRestaurant
);

export default router;