const Group = require('../models/Group');
const createMember = require('./MemberController').createMember;


exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({});
        if(groups.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'There\'re no groups available'
            })
        }
        return res.status(200).json({
            success: true,
            groups
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "Operation failed! Try again"
        })
    }
}

exports.getSingleGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findOne({_id: groupId}).exec();
        if(group.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'The requested group doesn\'t exist'
            })
        }
        return res.status(200).json({
            success: true,
            group
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "Operation failed! Try again"
        })
    }
}

exports.createGroup = async (req, res) => {
    try {
        //get input data
        const {title, admin}= req.body

        // Check if All Details are there or not
		if (!title || !admin) {
			return res.status(400).send({
				success: false,
				message: "All fields are required",
			});
		}

        //check if group already exists?
        const existingGroup = await Group.findOne({title})
        if(existingGroup){
            return res.status(400).json({
                success: false,
                message: "Group already exists"
            })
        }
        const group = await Group.create({title, admin});
        // Register admin as member to group
        // add code here
        // await createMember(req, res)

        return res.status(200).json({
            success: true,
            group,
            message: "Group created successfully"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "Group creation failed"
        })
    }
}

exports.updateGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const existingGroup = await Group.findOne({_id: groupId}).exec();
        if(!existingGroup) {
            return res.status(404).json({
                success: false,
                message: 'Group does not exist!'
            })
        }
        const group = await Group.findOneAndUpdate({_id:groupId}, req.body, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            succes: true,
            group
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "Group update failed! Try again"
        })
    }
}

exports.deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const existingGroup = await Group.findOne({_id: groupId}).exec();
        if(!existingGroup) {
            return res.status(404).json({
                success: false,
                message: 'Group does not exist!'
            })
        }
        const group = await Group.findOneAndDelete({_id:groupId});
        return res.status(200).json({
            success: true,
            message : 'Group deleted successfully'
        })
    } catch (error) {
        res.status(500).json({"error": "Something went wrong!"});
    }
}
