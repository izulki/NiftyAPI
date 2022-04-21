import express from 'express'
import userController from './topshot/user/acontroller'
import setController from './topshot/sets/asetController';

var router = express.Router();

//#### -------- TOPSHOT ROUTES -------- ####

//#### ---- TS: USER ROUTES ---- ####
router.route('/ts/user/flowid/:username').get(userController.getFlowID)
router.route('/ts/user/ownedMoments/:dapperID').get(userController.getOwnedMoments)

//#### ---- TS: SET ROUTES ---- ####
router.route('/ts/sets/all').get(setController.getAllSets)







export default router
