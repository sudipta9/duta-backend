const userModel = require("../model/userModel");

const isUserNameExists = async (userName) => {
  const user = await userModel.findOne({ userName: userName });
  if (!user || user === null) return true;
  else return false;
};

module.exports = isUserNameExists;
