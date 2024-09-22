import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as appointmentCtrl from '../controllers/appointment.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, appointmentCtrl.getAppointment);
// router.get('/:id', checkAuth, Ctrl.getUser);
router.post('/', checkAuth, appointmentCtrl.createAppointment);
router.put('/:id', checkAuth, appointmentCtrl.updateAppointment);
router.put('/appdec/:id', checkAuth, appointmentCtrl.approvedeclineAppointment);
router.delete('/:id', checkAuth, appointmentCtrl.deleteAppointment);

export { router as appointmentRouter };
