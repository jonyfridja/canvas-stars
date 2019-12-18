// src: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function getRandomFloat(min, max) {
  if (min < 0) {
    const positivePartRnd = getRandomFloat(0, max);
    const negativePartRnd = getRandomFloat(0, min * -1);
    return positivePartRnd - negativePartRnd;
  }
  return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}



function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getCollectionPairs(collection) {
  // returns unique pairs of stars
  const map = collection.map((itemA, idx) => {
    for (let i = idx + 1; i < collection.length; i++) {
      const itemB = collection[i];
      return [itemA, itemB];
    }
  })
  map.pop();
  return map;
}
export default {
  getRandomColor, getRandomInt, getRandomFloat, getCollectionPairs
}