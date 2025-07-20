const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const population = [];
const MAX_LIFESPAN = 3000; // in ticks (e.g. 3 seconds at 1000fps)
const HUMAN_COUNT = 300;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Human {
  constructor() {
    this.x = rand(0, canvas.width);
    this.y = rand(0, canvas.height);
    this.age = 0;
    this.speed = rand(0.5, 2);
    this.angle = rand(0, Math.PI * 2);
    this.color = `hsl(${Math.random() * 360}, 60%, 70%)`;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Bounce off walls
    if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
    if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;

    this.age++;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  isDead() {
    return this.age >= MAX_LIFESPAN;
  }
}

function spawnHuman() {
  population.push(new Human());
}

function nukeWorld() {
  population.length = 0;
  for (let i = 0; i < HUMAN_COUNT; i++) spawnHuman();
}

function animate() {
  // super fast fade to black for trail effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = population.length - 1; i >= 0; i--) {
    const h = population[i];
    h.update();
    h.draw();
    if (h.isDead()) population.splice(i, 1);
  }

  // spawn more to keep population stable
  while (population.length < HUMAN_COUNT) {
    spawnHuman();
  }

  requestAnimationFrame(animate);
}

// Auto reset after 15 seconds to simulate war and rebirth
setInterval(() => {
  console.log("💥 NUKE EVENT");
  nukeWorld();
}, 15000);

// Initial boot
nukeWorld();
animate();
