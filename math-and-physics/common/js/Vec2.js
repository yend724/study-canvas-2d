class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multi(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const { x, y, magnitude } = this;
    return new Vec2(x / magnitude, y / magnitude);
  }
}
