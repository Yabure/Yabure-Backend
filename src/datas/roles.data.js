const roles = {
  USER: ["canUploadBooks"],
  ADMIN: ["canUploadBooks", "canCreateUser", "canDeleteUser", "canDeleteBooks"],
  MODERATOR: ["canUploadBooks", "canDeleteBooks"],
};

module.exports = roles;
