const Data = require("../models/Data");
const mailSender = require("../utils/mailSender");

/**
 * Retrieves all members from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status, the members list, and a message.
 * If the members list is empty, the success status is true, the members list is empty, and a message is returned.
 * If the members list is not empty, the success status is true, the members list is returned, and no message is returned.
 * If an error occurs, the success status is false, and a failure message is returned.
 */

exports.PostData = async (req, res) => {
  try {
    const {turbidity, pH, TDS, salinity, temperature, volume} = req.body
    //email this data to the user
    await mailSender(
      "kumjude09@gmail.com",
      "Water Quality Data",
      `<div style="padding: 30px; text-align: center; background-color: #f5f5f5;">
      <h2 style="font-size: 24px; margin-bottom: 20px;">
        Water Quality Data
      </h2>
      <p>Turbidity: ${turbidity}</p>
      <p>pH: ${pH}</p>
      <p>TDS: ${TDS}</p>
      <p>Salinity: ${salinity}</p>
      <p>Temperature: ${temperature}</p>
      <p>Volume: ${volume}</p>
    </div>
    `
    );

    return res.status(200).json({
      success: true,
      message: "Data received successfully",
      turbidity: turbidity,
      pH: pH,
      TDS: TDS,
      salinity: salinity,
      temperature: temperature,
      volume: volume
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Operation failed! Try again",
    });
  }
};
