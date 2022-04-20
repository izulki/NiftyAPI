import flowID from './getFlowID'
import ownedMoments from './getOwnedMoments'

var userController = {
    getFlowID : function(req, res) {
        flowID (req, res)
    },
    getOwnedMoments : function(req, res) {
        ownedMoments (req, res)
    },
}

export default userController