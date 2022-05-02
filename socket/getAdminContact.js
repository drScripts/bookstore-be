const { Socket } = require("socket.io");
const { User } = require("../models");
const { getFileUrl } = require("../helpers");

/**
 *
 * @param {Socket} socket
 */
module.exports = async (socket) => {
  try {
    const admin = await User.findOne({
      where: { role: "admin" },
      include: "profile",
      attributes: {
        exclude: ["password"],
      },
    });

    if (admin) {
      admin.profile.profilePict = getFileUrl(
        admin?.profile?.profilePict,
        "profile"
      );
    }

    socket.emit("admin contact loaded", admin);
  } catch (err) {
    throw new Error("Can't get admin contact");
  }
};
