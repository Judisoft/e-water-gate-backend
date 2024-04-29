const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const logoUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA6hSURBVHgB7Z17cFTVGcC/c+/dZ3bzTgATAgghVHxVRDRSJCA+8IEz1jrWTqd/dOojRepABduxglDBUlsFtNNOZ9Ta/tHaGbUqI1QRhWoV0RYooFYMISAkIeS1z/s4/c4NF0Kyu7n37n1R9zezye7ek3t397ffOd937iMABTwFAZcJBAL1AHw9WAwhSlxR+C5CpEQqlWrDpxJwFiCA6/D1HAfzwXI44HnK1g+hUBgoJW0o6bNEIvEWPtkFHoUHlxEEXz0hYHmEDAW3UYw/J/h8viZB4MslSfJk1HxlhAyGEFLLxPj9PhBF8TPwEBx8haEU5geDwe+Ah/C0EH9ZbUXRmAvPBQsgfEBg6/JFR5ee8TzhLg+FQreCR/DAoD6cQOWkMZHaiy/1FVXUscfB6nM/79r16mZKJQVMgB86VzH1hmuEaNUEjAtFjHUe6m/96INUV0v7yRZNmO3twmzM9e7LU2OIv3x8dWl906yicy5o5P3hEq0N74+U84EIxQ/wCJigbMq8Rn9pzdcGHhHC+4tKQ1UTvxYoH1etiIkeOdEdw3GlAgf698FlPCHEX1Izo6zh6tmRmotm8oGiskztMFpq0Ewy3d3WbmD1EJ3QeGFoVMOM4UtUMWWhqklTAxXjR0nJXgpibJcsy66mxK4WhrOfoDM7P35+df/hjxoJkBHHMxQHHO9/6L8vLv17puUcRyrwVy12S5Pwfrho7LSGSN20OXrWzYiMm7Gx4uLbH966kHwILuGKECaC42Exbv3GE/s3Cd37N+n6u2DlJBg9895uSYArt91N9mZrV1xcXB6dfN3dvqLKZcQXiIJOInXToeqSOwDLyT9hBvaEG2IczbKanqTT5mygr3ACvIUybgETSQV+g0oFCTbOXkdrs7W5eHVPUcP3/vyDkinzdMtgSPET2jbu5AjsaHqKvjR7Pb0UHMQRIaqIp+iLhId/4sMbIc/sDj+wcTjdsvHq39KSocvm/IbWCBT+iHfHlU25FjhfCMxCKCxAMe8xMVevo18HB7BVyMmI+AuK+BD7AVMRkYMLZBGeG/zEpHU0ABKsxbuz2GMmQwiXQ54ITIzCwUdNG+jrGDFTwEZsEdK0jl6EEbFRFQFwG9gERsqCpvV0nfZ4LFUexyfvGNxGCJeBXvwl58AI27sWI2YfbvNVu8RYWhg2PU2nERmWs8GajYxOgDXMwjnr6RFZUjCP5ZqHLsc6Q/e6QpUTdbXDbd7A5GD0b1QorLRy8LdECIbyVHyRa0GB653O26gMIHYqq+PJThodU46lyum3JMW7INn5ua71sK4tPOYCMADb0M0YMTejmC2KDIu2LiJ7IE/yEsK6JszwV+Ldm5yKCA0mIt2hgNyr4GQIQKz3BIm3d0N4VClERw+IOb77Jd3rK51yDeTBHEzjd8/dQF8WFVjxzn3kYzCJKSGD6whweD6MSiiiE0X0KaqUM5Zh8RA7egL6Dx0EuedtjJA24ISRh8mSibMgWncZ5At+Jxfg5hZgj2G6jjHUwbCsCT/+NZh1zAaLRGBhCLoKQ4W92FKIVM9TI2IoffHDIMePgZxoB6m/VX0O56dACPmxOwpihZ9ZTBSLwcpL7gA7oARexte6yogYXUKYCMyYluPd68DiiBhRCH74Soqqt1zdYirdk3UZE8MH/TgfdloMS4lZnVI8cRbYjIRiNnFp+Pmb95P3RmqcUwgOVuPw1xq8fRNs6pqyCtEpQiOXEA0mxheJQvn586B0UqMVNYoRJPy0X8L3smTLD8nBbI1yfsho9jnsnq4CJ0ERcpICTVmfJQRGXYn7VqZDOh2C/mNpiNbKwPscm/AWUAb7YofxdkP2RjkgChx2LI1lEZE8GRE2kTy6Xb1x/hLoj9RhAnAVRGrGQtGochACzuQmONjnfIM5XwVmDMtkCjNxDXVgF1hZKQmqynAKBbu3dNdu9Rb/cjqEazHLGl2NKXMZivGBbVBopRx8P1eTnDnh5mZySJbV8OoGi2Epa+qoAukvFUdlDCXVsQN6/vN76GltgfZdX0B3C2ZqaQmsBt+hiGudvbWZHM3VTleHhAXPPFzh3/BuEPJkaB3Rd2gz9LVt1vW3RGBZUubZ22RqYOqcyim8JcEorBuL1n9b/U2w/C6qLsNbKQhBSyJGVogqY/tIDXWPEDiZtghf5xNgEiYCpzhAGlLQGRHiL54IlVPvybisu/f0FAmrRdQuqftTtXvSi4DjCpOiQXgeIqNKIFxVltcYg+PG0rcWkl/oaat7theLmyfR3qNgECoOTHEkDkggdg+vru2AD1VDqGbuqW+8XlhBmT6++9Rjiv1135EuaN/TAt1fHDXVlWHP8oheGQxD0+/l1bACf/1VT9tTIr5AEceVjNW13WjdEOH197Sprt3DnmNiYh09cGx3i9Ex5oVeH6wCAxgS8sK3SJrzYZZA4R/Z2mgi4gfcEzEYJiVYpX8vLIuSbN2cKgYnMI+xwf9gO8hiTjGfHOiE7+68i4hg5PWCQd64i/RACu5EKWccjqMwEe2nRYB7idMwhKixrF3sa825nCoKxI6dwKysRRUjpcQhy+Fz0pec37KcGM4uTO0x3LKEHEyn4RtYzMXUrEkbI7q8JULDyDjCkBPHdLVTWMSgmI49B6G3dUAMzjgnxbR4+5sPhg6ACUzvwt2+mHyqiPT15GGZei0ihsJSYTvbMzF9OO3f9dkRKsXE17Yv8e8Ek5gWgrtNl3MBcmtoHE+CtXyKCxrrK51Eiuv7xpvFHwnTioZaWjW1jvgi/ltxUnYNmMTUTNWcp+lS7K6GbVTqpSLrtrDytnH+ITOD6xCnYCKi55RDoCRM2EzyEB7DWd1lYBDDQlhk4F89nKuN1E/TWAQSJ8U4KcSP+1WitVU0UBzKJOI0FFZsWUiWgwEMCTkZikv1tGV7MZR+quA0SRrFmD9aTSdOCPEXhWi0piJbRGRjGUbKY3ob616rERlDkWKUiu2KhFPrtkWMnUJUEedU0GBZkbkx10Ck6BKSbcwwihxTxHS7us/DcjF2CPGFQ7SkrhICxWEr9grpGlNG3JCeMcMgFMcY0eoxxkohJ7smEiwtAkvRESkj7VM33U3pQU7QFO4T8ePu2ry/gVYI8YUCtHhcFQSLi+zcT5pzTMm6YdwH8jMcmFeAA8gxmsBpFz92ZaZ3cOcjxF8UVqK15SRYYquI0xBYvqWZrMi8KANz19Hz8KPZgyHm6IGh+dQxZoSMUEfYikTgvHeayb6hz2fc64L7fWMoQwaHj0oUiolPKOZtr2MG6oiBwdppEQzsefpw2ivjuYwZ0zh23BBKOR/vvgguIESIPzieFwJjeZELG58xzQYbrCsaxtLK8+oAuydwQYaEm3wNP/Rr3/8RyTifM+IratpA5+JKFqPW68EFWIEp91MQO7DATNFAtna5uiwmIjKmDIJlEVcigsFEYJezZqT96rpfnXruhwKr8e48cIlcdUwmIRbXEabADW+SCSxDEf/S2d4YqhiKdQmFm8AdKIqR0h30jMF/sBAWEcVjPSFilZ4jTYb8nTkal0jUV80B7957plIfFdPHZT9NMiEHMCL86qRfqLTItReV6onjvpHjLbvW100AE5jOotjxt3KrDLhPBPyjXBFDhCjxC1EBxBMKlJRWQWS0ej6hKzISXX3Q/2UXpGP55SB5p7XsWNwkimFCfOUoJuLs56Ee74W1SyzezQZtew8FHbptSjEiYqqIVJ8110KzrM6Q4xgxcWfFMBmJg5J6pIuUSOMu1MNQXl9juxRVRG8c+o8ct0yEhuWFnyYGd+mCr4ID7FbADpiE5KEBGRpiPAXHP22Dism1tkhhIpLdMYgd7bJchIZtlTg7gDp1WAYJI0Yos1aMJkNJD1/GIoVJqZwyFnifdW8v2d1vadeUDdunRrSIYWJ8lfkP/rlkaDApnfsPWSKFdU09re1q9DmBY3NVqhg2+GNXJqAYgWWmBt2wg/FSI8jQYFI69rZCFU6TmJHCuqbew50gxiybudGF45f4U9PlNowYTYzOwZ8N4HplnNoWzuAZlcLqCCYi3e/OFWRdu+aiJkbEOiaAdQyXoysbnE0Z3g5K0dN9qSLaOvKuI/LF9Ytgsjom0TqQlfnZGDOkK8tHhoY2pgzNvtT0FbumPkxf3Rah4ZmrkrKsLNl2Zh1DxQFZ1IJjIrXsi0lhkZLqs6eOyBfPXSZWy8qID8NEppaezsCksJNveEEAKWVgMHIQT163l8Giw5b1ygpIsjdlML7Slxr3IgUhHqMgxGMUhHiMghCPURDiMQpCPEZBiMcoCPEYBSEeoyDEYxSEeIx8hDhwoaWzFWJ6ZjQfIWuhwHDYRS458jKYxLSQ9zf4HqQgsVMVXocCDAqEfEA47rZPnp18P5jEkoOlrmimcxUiPYB387qifT64cWmNUxCyjecCy0O+cdt2/i6/a75YeljhjIXiNfg9WQwuiHFFCIrgCFkZ9tdvzVfEqVWCDUy/L97IKT52brtjYhwVQmEHAX7l/ufrXwGLsfWI6On3pqdzPLcGKJ0DNuOEEA74twGUVfv+0PAG2IQj5w7MuCd+OfDCr3BzV4BN2CmEI9w2wvke3/vMBNPZk14cPZlj+r1iI8fRX9ohxg4hWE28y/GBlXufneBYJunK2UZMDOHgx7jxW8AiLBTCirqtHJBH7eyasuHauXgMJobn4SFK1X8UkxcWCGF1xA5OgRX7nm/YCC7hqhCNxkXiLFlS/91eE5gkLyFY0GEd8eDeZ8ZvAZfxhBCNfOoYU0JYHUGFR8LBc9+2qo7IF08J0TBTxxgSgnUEFnQ/cWOMGAlPCtG4bCG9CEB6Us+/XdIjBIu5fxNC79v33OR3wKN4WoiGWsdwvrX4amdma5NLCCvoCC/82ok6Il/OCiEalzWLV+A3/PFMdUwmIW7UEflyVgnRGCgw4Ywx5kwhZCfP8w/sfWaS61mTUc5KIRpqgUmUnxLCzUchrKB7l6NY0LlYRxRApjWnL5ly5z5D/+q5QIECBQoU+H/jfyerlKPNoj89AAAAAElFTkSuQmCC";

    // Send the email using our custom mailSender function
    const mailResponse = await mailSender(
      email,
      "Account Verification",
      `<div style="padding: 30px; text-align: center; background-color: #f5f5f5;">
		   <img src="${logoUrl}" alt="Logo" style="width: 75px; height: 75px; margin-bottom: 20px;">
		   <h2 style="font-size: 24px; margin-bottom: 20px;">
			   Please use the following OTP to verify your account: 
		   </h2>
		   <h1 style="font-size: 48px; margin-bottom: 20px; color: #2563EB;">
			   ${otp}
		   </h1>
		 </div>
		`
    );

    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
