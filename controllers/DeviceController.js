const { getDatabase, ref, set } = require("firebase/database");

exports.createDevice = async (req, res) => {
    try {
        const { deviceId, deviceName } = req.body;

        if (!deviceId || !deviceName) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required'
             });
        }

        const database = getDatabase();
        const deviceRef = ref(database, `devices/${deviceId}`);

        const deviceData = {
            deviceId,
            deviceName,
            createdAt: new Date().toISOString()
        };

        await set(deviceRef, deviceData);

        return res.status(201).json({ 
            success: true, 
            message: 'Device added successfully', 
            device: deviceData 
        });
    } catch (error) {
        console.error('Error adding device: ', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

