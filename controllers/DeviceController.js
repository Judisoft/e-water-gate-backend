const { getDatabase, ref, set, get } = require("firebase/database");

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

exports.getAllDevices = async (req, res) => {
    try {
        const database = getDatabase();
        const devicesRef = ref(database, 'devices');
        const allocatedDevicesRef = ref(database, '/');

        const snapshot = await get(devicesRef);
        const allocatedDevicesSnapshot = await get(allocatedDevicesRef)

        if (!snapshot.exists()) {
            return res.status(404).json({ success: false, message: 'No devices found' });
        }

        const devices = [];
        const allocatedDevices = [];
        snapshot.forEach((childSnapshot) => {
            devices.push(childSnapshot.val());
        });
        allocatedDevicesSnapshot.forEach((childSnapshot) => {
            allocatedDevices.push(childSnapshot.key);
        })

        return res.status(200).json(
            { 
                success: true, 
                devices:{devices: devices, allocatedDevices: allocatedDevices}, 
                message: 'Devices fetched successfully'}
        );
    } catch (error) {
        console.error('Error fetching devices: ', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

