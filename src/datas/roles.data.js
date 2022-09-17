const roles = {
  USER: [],
  ADMIN: ["canUploadBooks", "canCreateUser", "canDeleteUser", "canDeleteBooks"],
  MODERATOR: ["canUploadBooks", "canDeleteBooks"],
};

module.exports = roles;
