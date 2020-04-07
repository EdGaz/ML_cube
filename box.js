class Box {
  constructor(brain) {

  //position
    this.x = 100;
    this.y = 300;
    this.l = 40;
    this.velocity = 1;

  //state
    this.walking = true;
    this.jumping = false;

    this.power = BOX_MAX_POWER

    
  //brain
    if(brain){
      this.brain = new NeuralNetwork(3, 4, 3, brain);
    }
      
    else
      this.brain =  new NeuralNetwork(3,4,3);
    this.score = 0;
    this.fitness = 0;

  }

  show() {
    stroke(255);
    fill(255,20);
    rect(this.x, this.y, this.l, this.l);
  }

  think(plats){
    let input = []
    input [0] = plats[1].x / width             //next plat position
    input [1] = map(plats[0].x+plats[0].l,-1000,1000,0,1)  //current plat border position
    input [2] = this.walking ? 1 : 0
    let output = this.brain.predict(input)
    if(output[0] > output[1]){
      this.jump()
    }
    this.power = round(map(output[2], 0,1,BOX_MIN_POWER,BOX_MAX_POWER))
  }

  update() {
    this.score++

    if (this.jumping) {
      this.velocity = -1;
      if (height - this.power - this.l - 40 > this.y) {
        this.velocity = 1;
        this.jumping = false;
      }
      
      
    }

    if (this.y < height - this.power - this.l -20) {
      this.velocity *= 0.5;
    }
    
    this.y += this.velocity;
  }

  jump() {
    if (this.walking) {
      this.jumping = true;
    }
  }

  walk(plat) {
    if (
      this.y + this.l == plat.y &&
      this.x < plat.x + plat.l &&
      this.x + this.l > plat.x
    ) {
      this.walking = true;
      if (!this.jumping) this.velocity = 0;
      return true;
    } else {
      this.walking = false;
      this.velocity = 1;
      return false;
    }
  }


  die(){
      if (this.y >= height){
          return true
      }else return false
  }

  dispose(){
    this.brain.dispose()
  }

  mutate(){
    this.brain.mutate(MUTATION_RATE)
  }
}
