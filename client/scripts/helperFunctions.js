function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function sortByZ(a,b) {
    if (a.zIndex < b.zIndex) return -1;
    if (a.zIndex > b.zIndex) return 1;
    return 0;
}
