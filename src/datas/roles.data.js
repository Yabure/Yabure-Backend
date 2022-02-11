const roles = {
  uploader: [],
  admin: ["canUploadBooks", "canCreateUser", "canDeleteUser", "canDeleteBooks"],
  moderator: ["canUploadBooks", "canDeleteBooks"],
};

module.exports = roles;
