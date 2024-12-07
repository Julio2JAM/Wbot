import { Request, Response, Router } from "express";
import { whatsappController } from "../controller/whatsappController";

const router = Router();
const controller = new whatsappController();

router.get('/', async (req:Request, res:Response) => {
    const response = await controller.get(req);
    res.status(response.status).json(response.response);
});

router.post('/', async (req:Request, res:Response) => {
    const response = await controller.post(req);
    res.status(response.status).json(response.response);
});

export default router;