const userModel = require("../model/userModel");

const isUserExists = async (userName, mobileNumber) => {
  const user = await userModel.findOne({
    $or: [{ userName }, { mobileNumber }],
  });
  if (!user || user === null) return true;
  else return false;
};

module.exports = isUserExists;
