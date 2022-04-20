import express from 'express'
import userController from './topshot/user/acontroller'

var router = express.Router();

//#### ---- TOPSHOT ROUTES ---- ####
router.route('/ts/user/flowid/:username').get(userController.getFlowID)
router.route('/ts/user/ownedMoments/:dapperID').get(userController.getOwnedMoments)







export default router
