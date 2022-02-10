const addDateToCurrentDate = (days) => {
  const d = new Date();
  return `${new Date(d.setDate(d.getDate() + days)).toUTCString()}`;
};

// export const generateCookieExpiryDate = (rememberMe = false) => {
//   const expiresIn = new Date();

//   if (rememberMe) {
//     // Extended period of time
//     return expiresIn.setMinutes(
//       expiresIn.getMinutes() + config.rememberMeTokenLife
//     );
//   }

//   return expiresIn.setMinutes(expiresIn.getMinutes() + config.tokenLife);
// };

module.exports = addDateToCurrentDate;
