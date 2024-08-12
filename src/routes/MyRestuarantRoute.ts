import  express  from 'express';
import multer from 'multer';
import MyRestuarantController from '../controllers/MyRestuarantController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyRestuarantRequest } from '../middleware/validation';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});


router.get("/",
    jwtCheck,
    jwtParse,
    MyRestuarantController.getMyRestuarant
);
router.post(
    "/",
    upload.single("imageFile"), 
    validateMyRestuarantRequest,
    jwtCheck,
    jwtParse,
    MyRestuarantController.createMyRestuarant
);

router.put("/",
    upload.single("imageFile"), 
    validateMyRestuarantRequest,
    jwtCheck,
    jwtParse,
    MyRestuarantController.updateMyRestuarant
)

export default router;