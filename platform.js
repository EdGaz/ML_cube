class Platform {
  constructor(x, l) {
    this.x = x || 0;
    this.h = 40;
    let r = random(0, 100);
    let space;
    if (r < brutality) {
      space = BRUTAL_LENGTH;
    } else {
      space = random(min_length, max_length);
    }

    this.l = l || space;

    this.y = height - this.h;
  }

  show() {
    fill(200, 0, 0);
    rect(this.x, this.y, this.l, this.h);
  }

  update() {
    this.x--;
  }

  isOffScreen() {
    if (this.x + this.l <= 0) return true;
    else return false;
  }
}
