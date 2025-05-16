const checkFirstName = (firstName) => {
    if (typeof firstName !== "string") {
        throw Error("Firstname must be a string")
      }
    if (firstName.length < 2) {
        throw Error("Firstname length must be at least 3 charcter")
    }
    return firstName

}

const checkLastName = (lastName) => {
    if (typeof lastName !== "string") {
        throw Error("Lastname must be a string")
      }
    if (firstName.length < 2) {
        throw Error("Lastname length must be at least 3 charcter")
    }
    return lastName

}

const checkPhoneNumber = (phoneNumber) => {

}

const checkEmail = (email) => {
    if (typeof email !== "string") {
      throw Error("Email must be a string")
    }
    const trimmedEmail = email.trim()
    if (trimmedEmail.length === 0) {
      throw Error("Email cannot be empty")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(trimmedEmail)) {
      throw Error("Please provide a valid email address")
    }
    
    return trimmedEmail
  }

module.exports = {
    checkFirstName,
    checkLastName,
    checkPhoneNumber,
    checkEmail
}