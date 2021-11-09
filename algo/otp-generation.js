
class OTP {

    generateOTP( min,max ) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

}

module.exports = OTP;