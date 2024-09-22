import { Router } from 'express';
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js';
import * as patientCtrl from '../controllers/patient.js';

const router = Router();

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken);
router.get('/', checkAuth, patientCtrl.getPatientRecords);
router.get('/:id', checkAuth, patientCtrl.getPatientRecord);
router.post('/', checkAuth, patientCtrl.createPatientRecord);
router.put('/:id', checkAuth, patientCtrl.updatePatientRecord);
router.delete('/:id', checkAuth, patientCtrl.deletePatientRecord);

export { router as patientRouter };
