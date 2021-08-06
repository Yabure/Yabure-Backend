const helper = {}

helper.randomSixDigits = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};

module.exports = helper
  