import utilService from './utilService.js';
let gStars = []
const moveRange = 0.4;

class Star {
  constructor(canvasDim) {
    this._canvasDim = canvasDim;
    this._pos = {
      x: utilService.getRandomInt(10, canvasDim.width - 10),
      y: utilService.getRandomInt(10, canvasDim.height - 10)
    };
    this.color = utilService.getRandomColor();
    this.radius = utilService.getRandomFloat(1, 3);
    this._velocity = {
      x: utilService.getRandomFloat(-moveRange, moveRange),
      y: utilService.getRandomFloat(-moveRange, moveRange),
    }
  }

  get pos() {
    const pos = { ...this._pos };
    return pos;
  }

  movePos() {
    this._updateVelocity()
    this._pos.x += this._velocity.x;
    this._pos.y += this._velocity.y;
  }
  _updateVelocity() {
    const { _pos, _velocity, _canvasDim } = this;
    if (_pos.x + _velocity.x > _canvasDim.width) _velocity.x *= -1;
    if (_pos.x + _velocity.x < 0) _velocity.x *= -1;

    if (_pos.y + _velocity.y < 0) _velocity.y *= -1;
    if (_pos.y + _velocity.y > _canvasDim.width) _velocity.y *= -1;
  }

  distance(pos) {
    const { _pos } = this;

    const xDiff = Math.abs(_pos.x - pos.x)
    const yDiff = Math.abs(_pos.y - pos.y)

    return Math.sqrt(yDiff ** 2 + xDiff ** 2);
  }

}
export default Star;

export function initStars(starCount, canvasDim) {
  for (let i = 0; i < starCount; i++) {
    const star = new Star(canvasDim);
    gStars.push(star);
  }
}

export function getStars() {
  return gStars;
}

export function getStarsByDistanceAndPos(minDistance, pos) {
  return gStars.filter(star => {
    return minDistance >= star.distance(pos);
  })
}