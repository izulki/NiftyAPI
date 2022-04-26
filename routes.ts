import express from 'express';
import userController from './topshot/user/acontroller';
import setController from './topshot/sets/asetController';
import momentController from './topshot/moments/amomentController';

var router = express.Router();

//#### -------- TOPSHOT ROUTES -------- ####

//#### ---- TS: USER ROUTES ---- ####
router.route('/ts/user/flowid/:username').get(userController.getFlowID)
router.route('/ts/user/ownedMoments/:dapperID').get(userController.getOwnedMoments)

//#### ---- TS: SET ROUTES ---- ####
router.route('/ts/sets/all').get(setController.getAllSets)
router.route('/ts/sets/momentsfromset/:id').get(setController.getMomentsFromSet)


//#### ---- TS: MOMENT ROUTES ---- ####
router.route('/ts/moments/specific/:id').get(momentController.getSpecificSetPlay)







export default router
