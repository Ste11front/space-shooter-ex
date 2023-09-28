// Dopo un certo tempo deve spawnare un boss con 3 fasi (con uno switch)
// Fase 1: Il boss si crea fuori dalla mappa e scende dall'alto fermandosi al centro
// Fase 2: Il boss diventa un random walker (si muove a caso per la canvas). Quando arriva a metà vita entra nella fase 3 
// Fase 3: Il boss spara dai quattro lati contemporaneamente

class Boss extends BaseEnemy {
    constructor(x, y, width, height) {
        super(x, y, width * 2, height * 2);
        this.speed = 2;
        this.projectiles = [];
        this.attackCD = 38;
        this.healthPoints = 50;
        this.phase = 1;
        // Aggiunte le proprietà targetX e targetY
        this.targetX = randomBetween(0, canvasWidth - this.width);
        this.targetY = randomBetween(0, canvasHeight - this.height);
        this.score = 4000;
        // Integrazione asset
        this.img = new Image();
        this.img.src = 'assets/boss.png';
    }

    draw(ctx) {
        // ctx.fillStyle = "red";
        super.draw(ctx);
        this.attackCD--;

        this.projectiles = this.projectiles.filter(p => p.isAlive);
        this.projectiles.forEach(p => {
            p.draw(ctx);
            p.move();
        })

        this.projectiles = this.projectiles.filter(p => {
            // Controlla se il proiettile è ancora vivo e all'interno del canvas
            return p.isAlive && p.y > 0 && p.y < canvasHeight && p.x > 0 && p.x < canvasWidth;
        });

        switch (this.phase) {
            case 1:
                if (this.y < canvasHeight / 2) {
                    this.y += 2;
                } else {
                    this.phase = 2;
                }
                break;
            case 2:
                if (this.healthPoints <= 25 || bossSpawned === true) {
                    this.phase = 3;
                } else {
                    // Se il boss è vicino alla posizione target, genera una nuova posizione target
                    if (Math.abs(this.x - this.targetX) < 10 && Math.abs(this.y - this.targetY) < 10) {
                        this.targetX = randomBetween(0, canvasWidth - this.width);
                        this.targetY = randomBetween(0, canvasHeight - this.height);
                    }

                    // Muove il boss verso la posizione target
                    if (this.x < this.targetX) {
                        this.x += 2;
                    } else if (this.x > this.targetX) {
                        this.x -= 2;
                    }
                    if (this.y < this.targetY) {
                        this.y += 2;
                    } else if (this.y > this.targetY) {
                        this.y -= 2;
                    }
                }
                break;
            case 3:
                // Se il boss è vicino alla posizione target, genera una nuova posizione target
                if (Math.abs(this.x - this.targetX) < 10 && Math.abs(this.y - this.targetY) < 10) {
                    this.targetX = randomBetween(0, canvasWidth - this.width);
                    this.targetY = randomBetween(0, canvasHeight - this.height);
                }

                // Muove il boss verso la posizione target
                if (this.x < this.targetX) {
                    this.x += 2;
                } else if (this.x > this.targetX) {
                    this.x -= 2;
                }
                if (this.y < this.targetY) {
                    this.y += 2;
                } else if (this.y > this.targetY) {
                    this.y -= 2;
                }

                if (this.attackCD <= 0) {
                    let projectile1 = new Projectile(this.x + this.width / 2, this.y + this.height / 2, 5, 20, "projEnemy");
                    projectile1.speed = -15;

                    let projectile2 = new Projectile(this.x + this.width / 2, this.y + this.height / 2, 5, 20, "projEnemy");
                    projectile2.speed = -15;

                    let projectile3 = new Projectile(this.x + this.width / 2, this.y + this.height / 2, 5, 20, "projEnemy");
                    projectile3.speed = -15;

                    let projectile4 = new Projectile(this.x + this.width / 2, this.y + this.height / 2, 5, 20, "projEnemy");
                    projectile4.speed = -15;

                    projectile1.move = function () { projectile1.x -= projectile1.speed; }
                    projectile2.move = function () { projectile2.x += projectile2.speed; }
                    projectile3.move = function () { projectile3.y -= projectile3.speed; }
                    projectile4.move = function () { projectile4.y += projectile4.speed; }

                    this.projectiles.push(projectile1);
                    this.projectiles.push(projectile2);
                    this.projectiles.push(projectile3);
                    this.projectiles.push(projectile4);

                    this.attackCD = 38;
                }
                break;
            default:
                break;
        }
    }

    move() {
        // Non fa nulla
    }

    death() {
        super.death();
    }
}

// Funzione che genera un numero casuale tra due valori
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}