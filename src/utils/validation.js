const validator = require("validator");

const validationSignup = (req) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (
        !firstName || !lastName ||
        firstName.length < 4 || firstName.length > 50 ||
        lastName.length < 4 || lastName.length > 50
    ) {
        throw new Error("Enter a valid name");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Enter a valid email");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }

    if (!/^\d{10}$/.test(phone)) {
        throw new Error("Enter a valid phone number");
    }
};

module.exports = { validationSignup };