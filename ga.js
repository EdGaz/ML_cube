function nextGeneration() {
  calculateFitness();

  score = 0;
  for (let i = 0; i < POPULATION; i++) {
    boxs.push(pickOne());
  }

  if (allBoxs.length > 0) {
    for (let i = 0; i < POPULATION; i++) {
      allBoxs[i].dispose();
    }
  }

  allBoxs = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r = r - allBoxs[index].fitness;
    index++;
  }
  index--;

  let box = allBoxs[index];
  let child = new Box(box.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;

  allBoxs.forEach(box => {
    sum += box.score;
  });

  allBoxs.forEach(box => {
    box.fitness = box.score / sum;
  });
}
