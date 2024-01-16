const express = require('express');
const router = express.Router();

 const {getAllGroups, getSingleGroup, createGroup, updateGroup, deleteGroup} = require('../controllers/GroupController')
 const {auth, isMember, isAdmin, isSysAdmin} = require('../middlewares/authMiddle')

router.get('/groups', getAllGroups);
router.get('/groups/:id',auth, getSingleGroup);
router.post('/groups',auth, isAdmin, createGroup);
router.put('/groups/:id',auth, isAdmin, updateGroup);
router.delete('/groups/:id',auth, deleteGroup);

module.exports = router;