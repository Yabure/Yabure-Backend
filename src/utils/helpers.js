const helper = {};

helper.randomSixDigits = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

helper.removeOneFromArray = async (array, item) => {
  const itemIndex = array.indexOf(item);
  if (itemIndex > -1) {
    await array.splice(itemIndex, 1);
    return array;
  }

  return;
};

module.exports = helper;
