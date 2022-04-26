import allSets from './getAllSets'
import momentsFromSet from './getMomentsFromSet'

var setController = {
    getAllSets : function(req, res) {
        allSets (req, res)
    },
    getMomentsFromSet : function(req, res) {
        momentsFromSet (req, res)
    },
}

export default setController