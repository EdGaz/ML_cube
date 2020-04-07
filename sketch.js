const POPULATION = 50;

const MIN_SPACING = 140;
const MAX_SPACING = 170;

const MIN_LENGTH = 150;
const MAX_LENGTH = 800;
const BRUTAL_CHANCE = 5; // over 100
const BRUTAL_LENGTH = 40; //TODO avoid brutal for first plats

const BOX_MAX_POWER = 130;
const BOX_MIN_POWER = 30;

const MUTATION_RATE = 0.1;

let level = 1; //DIFFICULTY LEVEL
let min_space = MIN_SPACING / (1 + level / 10);
let max_space = MAX_SPACING * (1 + level / 10);
let min_length = MIN_LENGTH / (1 + level / 10);
let max_length = MAX_LENGTH * (1 + level / 10);
let brutality = BRUTAL_CHANCE * level;

let boxs = [];
let allBoxs = [];
let plats = [];

let score = 0;
let generationCounter = 1;
let bestGen = [];

let slider;

let bestBox = null;
let loadedBrain = null;

function preload() {}

function setup() {
  createCanvas(640, 480);
  slider = createSlider(1, 100, 10);

  tf.setBackend("cpu");

  for (let i = 0; i < POPULATION; i++) {
    let box = new Box();
    boxs.push(box);
  }

  let plat1 = new Platform(null, 800);
  let plat2 = new Platform(plat1.x + plat1.l + MIN_SPACING);
  let plat3 = new Platform(plat2.x + plat2.l + MAX_SPACING);
  plats.push(plat1);
  plats.push(plat2);
  plats.push(plat3);
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    plats.forEach((plat, index) => {
      plat.update();
      if (plat.isOffScreen()) {
        score++;

        if (level == score / 10) level += 1;

        plats.push(
          new Platform(
            plats[index + 2].x +
              plats[index + 2].l +
              random(min_space, max_space)
          )
        );
        plats.splice(0, 1);
      }
    });

    boxs.forEach((box, index) => {
      box.think(plats);
      box.update();
      box.walk(plats[0]);

      if (box.die()) {
        allBoxs.push(box);
        boxs.splice(index, 1);
      }
      if (boxs.length == 0 && bestGen.length > 0 && score > bestGen[0].score) {
        console.log("score: " + score);
        box.brain.save();
      }
    });

    if (boxs.length == 0) {
      reset();
      generationCounter++;
      nextGeneration();
    }
  }

  display();
}

function keyPressed() {
  switch (key) {
    case "S":
      boxs[0].brain.save();
      break;

    case "L":
      loadBest();
      break;
    
    case "T":
      train();
      break;

    case "R":
      reset();
      break;
    default:
      break;
  }
}

function display() {
  //DRAWINGS

  background(0);
  noStroke();
  fill(255);
  textSize(28);

  text("generation:" + " " + generationCounter, 30, 30);
  text("players:" + " " + boxs.length, 30, 70);
  text("score:" + " " + score, 30, 110);

  textSize(20);
  fill(255, 0, 0);
  text("LEADERBOARD", 400, 20);
  fill(255);
  text("gen:", 400, 50);
  text("score:", 500, 50);
  if (bestGen.length > 0) {
    fill(0, 255, 0);
    text("1°", 360, 80);
    text(bestGen[0].num, 400, 80);
    text(bestGen[0].score, 500, 80);
  }
  if (bestGen.length > 1) {
    fill(0, 255, 0, 95);
    text("2°", 360, 110);
    text(bestGen[1].num, 400, 110);
    text(bestGen[1].score, 500, 110);
  }
  if (bestGen.length > 2) {
    fill(0, 255, 0, 90);
    text("3°", 360, 140);
    text(bestGen[2].num, 400, 140);
    text(bestGen[2].score, 500, 140);
  }
  boxs.forEach(box => {
    box.show();
  });

  plats.forEach(plat => {
    plat.show();
  });
}

function reset() {
  //UPDATE LEADERBOARD
  let alreadyExists = false;
  for (let i = 0; i < bestGen.length; i++) {
    if (bestGen[i].num == generationCounter) {
      alreadyExists = true;
    }
  }
  if (!alreadyExists) {
    if (bestGen.length == 0) {
      bestGen.push({
        num: generationCounter,
        score: score
      });
    }
    if (bestGen.length >= 1 && score > bestGen[0].score) {
      bestGen.splice(0, 0, {
        num: generationCounter,
        score: score
      });
    } else if (bestGen.length >= 2 && score > bestGen[1].score) {
      bestGen.splice(1, 0, {
        num: generationCounter,
        score: score
      });
    } else if (bestGen.length == 3 && score > bestGen[2].score) {
      bestGen.splice(2, 0, {
        num: generationCounter,
        score: score
      });
    }
  }
  if (bestGen.length > 3) {
    bestGen.splice(3, 1);
  }

  //RESET SCENARIO
  level = 1;
  plats = [];
  if (boxs.length > 0) boxs = [];
  let plat1 = new Platform(null, 800);
  let plat2 = new Platform(plat1.x + plat1.l + MIN_SPACING);
  let plat3 = new Platform(plat2.x + plat2.l + MAX_SPACING);
  plats.push(plat1);
  plats.push(plat2);
  plats.push(plat3);
}

function loadBest() {
  reset();
  loadedBrain = tf.loadLayersModel("localstorage://best_box");
  boxs.push(new Box(loadedBrain));
}

function train() {
  reset();
  
  for (let i = 0; i < POPULATION; i++) {
    let box = new Box();
    boxs.push(box);
  }
}
