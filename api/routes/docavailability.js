import { Router } from "express";
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js";
import * as dcAvailabilityCtrl from "../controllers/docavailability.js";

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get("/", checkAuth, dcAvailabilityCtrl.getDocAvailability);
// router.get('/:id', checkAuth, Ctrl.getUser);
router.post("/", checkAuth, dcAvailabilityCtrl.createDocAvailability);
// router.put('/:id', checkAuth, appointmentCtrl.updateAppointment);
// router.put('/appdec/:id', checkAuth, appointmentCtrl.approvedeclineAppointment);
router.delete("/:id", checkAuth, dcAvailabilityCtrl.deleteDocAvailability);

export { router as docavailabilityRouter };
