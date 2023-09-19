class Player extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.speed = 11;
        this.controller = {};
        this.projectiles = [];
        this.cooldown = 15;
        this.healthPoints = 10;
        this.score = 0;
        this.isPlayer = true;
        // Integrazione asset
        this.img = new Image();
        this.img.src = 'assets/player.gif';
    }

    draw(ctx) {
        ctx.save(); // Salva stato
        ctx.shadowColor = "blue"; // Effetto di luce
        ctx.shadowBlur = 10; // Effetto sfocatura
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // Disegna l'immagine solo se è pronta
        }
        ctx.restore(); // Ripristina stato per evitare modifiche ad altri oggetti
        // ctx.fillStyle = "green";
        // super.draw(ctx);
        this.cooldown--;
        this.projectiles = this.projectiles.filter((p) => p.isAlive);
        for (let i = 0; i < this.projectiles.length; i++) {
            const proj = this.projectiles[i];
            proj.draw(ctx);
            proj.move();
        }
        console.log(this.healthPoints);
    }

    control(canvasWidth, canvasHeight) {
        document.onkeydown = (keyevent) => {
            this.controller[keyevent.key] = true;
        };

        document.onkeyup = (keyevent) => {
            this.controller[keyevent.key] = false;
        };

        if (this.controller["ArrowLeft"]) {
            this.x = this.x > 0 ? this.x - this.speed : 0;
        }

        if (this.controller["ArrowRight"]) {
            this.x = this.x + this.width < canvasWidth ? this.x + this.speed : canvasWidth - this.width;
        }

        if (this.controller["ArrowUp"]) {
            this.y = this.y > 0 ? this.y - this.speed : 0;
        }

        if (this.controller["ArrowDown"]) {
            this.y = this.y + this.height < canvasHeight ? this.y + this.speed : canvasHeight - this.height;
        }

        if (this.controller[" "]) {
            this.baseAttack();
        }

        // Aggiungi un listener per l'evento touchstart
document.addEventListener('touchstart', (event) => {
    // Ottieni le coordinate del tocco
    let touch = event.touches[0];
    let touchX = touch.clientX;
    let touchY = touch.clientY;

    // Controlla in quale parte dello schermo è avvenuto il tocco
    if (touchX < window.innerWidth / 2 && touchY > window.innerHeight / 2) {
        // Se il tocco è nella parte inferiore sinistra dello schermo, simula la pressione del tasto spazio
        this.controller[" "] = true;
    } else if (touchX > window.innerWidth / 2 && touchY > window.innerHeight / 2) {
        // Se il tocco è nella parte inferiore destra dello schermo, suddividi in quattro parti per simulare le frecce direzionali
        let quadrantWidth = window.innerWidth / 4;
        let quadrantHeight = window.innerHeight / 4;
        if (touchX < quadrantWidth * 3) {
            this.controller["ArrowLeft"] = true;
        } else if (touchX > quadrantWidth * 3) {
            this.controller["ArrowRight"] = true;
        }
        if (touchY < quadrantHeight * 3) {
            this.controller["ArrowUp"] = true;
        } else if (touchY > quadrantHeight * 3) {
            this.controller["ArrowDown"] = true;
        }
    }
});

// Aggiungi un listener per l'evento touchend
document.addEventListener('touchend', () => {
    // Quando il tocco termina, rilascia tutti i controlli
    this.controller[" "] = false;
    this.controller["ArrowLeft"] = false;
    this.controller["ArrowRight"] = false;
    this.controller["ArrowUp"] = false;
    this.controller["ArrowDown"] = false;
});
    }

    baseAttack() {
        if (this.cooldown <= 0) {
            let proj = new Projectile(
                this.x + this.width / 2 - 2.5,
                this.y,
                5,
                20,
                "projPlayer" // Passa "projPlayer" come shot
            );
            this.projectiles.push(proj);
            this.cooldown = 15;
        }
    }
    
    death(){
        if (this.healthPoints <= 0) {}
    }
}