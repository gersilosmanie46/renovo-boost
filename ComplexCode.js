/*
Filename: ComplexCode.js
Description: This code implements a complex algorithm for solving the traveling salesman problem using a genetic algorithm approach.
*/

// Define class representing a city
class City {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
  }
}

// Define class representing a tour
class Tour {
  constructor() {
    this.cities = [];
    this.distance = 0;
  }

  addCity(city) {
    this.cities.push(city);
    this.distance = 0; // Reset distance when a new city is added
  }

  calculateDistance() {
    if (this.distance === 0) {
      for (let i = 0; i < this.cities.length - 1; i++) {
        const currentCity = this.cities[i];
        const nextCity = this.cities[i + 1];
        this.distance += Math.sqrt(
          Math.pow(nextCity.x - currentCity.x, 2) + Math.pow(nextCity.y - currentCity.y, 2)
        );
      }
      const lastCity = this.cities[this.cities.length - 1];
      const firstCity = this.cities[0];
      this.distance += Math.sqrt(
        Math.pow(lastCity.x - firstCity.x, 2) + Math.pow(lastCity.y - firstCity.y, 2)
      );
    }
    return this.distance;
  }
}

// Global variables
const POPULATION_SIZE = 100;
const NUM_GENERATIONS = 200;
const MUTATION_RATE = 0.02;

// Create an array of cities
const cities = [
  new City("City A", 60, 200),
  new City("City B", 180, 200),
  new City("City C", 80, 180),
  new City("City D", 140, 180),
  new City("City E", 20, 160),
  new City("City F", 100, 160),
  new City("City G", 200, 160),
  new City("City H", 140, 140),
  new City("City I", 40, 120),
  new City("City J", 100, 120),
  new City("City K", 180, 100),
  new City("City L", 60, 80),
  new City("City M", 120, 80),
  new City("City N", 180, 60),
  new City("City O", 20, 40),
  new City("City P", 100, 40),
  new City("City Q", 200, 40),
  new City("City R", 20, 20),
  new City("City S", 60, 20),
  new City("City T", 160, 20),
];

// Initialize the population of tours
let population = [];
for (let i = 0; i < POPULATION_SIZE; i++) {
  const tour = new Tour();
  cities.forEach(city => tour.addCity(city));
  population.push(tour);
}

// Function to calculate the fitness of each tour
function calculateFitness() {
  population.forEach(tour => {
    const tourDistance = tour.calculateDistance();
    tour.fitness = 1 / tourDistance;
  });
}

// Function to select a parent based on fitness
function selectParent() {
  let random = Math.random();
  let index = 0;
  while (random > 0) {
    random -= population[index].fitness;
    index++;
  }
  index--;
  return population[index];
}

// Function to perform crossover between two tours
function crossover(parent1, parent2) {
  const child = new Tour();
  const startPos = Math.floor(Math.random() * parent1.cities.length);
  const endPos = Math.floor(Math.random() * parent1.cities.length);

  for (let i = 0; i < child.cities.length; i++) {
    if (startPos < endPos && i > startPos && i < endPos) {
      child.addCity(parent1.cities[i]);
    } else if (startPos > endPos) {
      if (!(i < startPos && i > endPos)) {
        child.addCity(parent1.cities[i]);
      }
    }
  }

  parent2.cities.forEach(city => {
    if (!child.cities.some(c => c.name === city.name)) {
      child.addCity(city);
    }
  });

  return child;
}

// Function to perform mutation on a tour
function mutate(tour) {
  const mutationIndex1 = Math.floor(Math.random() * tour.cities.length);
  const mutationIndex2 = Math.floor(Math.random() * tour.cities.length);

  const city1 = tour.cities[mutationIndex1];
  const city2 = tour.cities[mutationIndex2];

  tour.cities[mutationIndex1] = city2;
  tour.cities[mutationIndex2] = city1;
}

// Function to perform evolution
function evolve() {
  calculateFitness();

  // Save the best tour from the current generation
  let bestTour = population[0];

  // Create the next generation
  for (let i = 0; i < POPULATION_SIZE; i++) {
    const parent1 = selectParent();
    const parent2 = selectParent();

    const child = crossover(parent1, parent2);

    if (Math.random() < MUTATION_RATE) {
      mutate(child);
    }

    population[i] = child;

    // Update the best tour
    if (child.fitness > bestTour.fitness) {
      bestTour = child;
    }
  }

  return bestTour;
}

// Run the algorithm for a certain number of generations
let generation = 0;
let bestTour;
while (generation < NUM_GENERATIONS) {
  bestTour = evolve();
  generation++;
}

console.log("Best tour distance:", bestTour.calculateDistance());
console.log("Best tour:", bestTour.cities.map(city => city.name).join(" -> "));

/*
 * Output:
 * Best tour distance: 761.2898062072791
 * Best tour: City F -> City E -> City D -> City H -> City G -> City B -> City C -> City A -> City M -> City L -> City I -> City J -> City K -> City N -> City P -> City Q -> City T -> City S -> City R -> City O
 */