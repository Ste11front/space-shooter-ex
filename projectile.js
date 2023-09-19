class Projectile extends GameObject{

    constructor(x, y, width, height, shot){
        super(x, y, width, height);
        this.speed = 15;
        this.isAlive = true;
        this.healthPoints = 1;
        this.shot = shot; // Proprietà che indica chi ha sparato il proiettile
    }

    draw(ctx){
        ctx.save(); // Salva lo stato corrente del contesto
        if (this.shot === "projPlayer") {
            ctx.shadowColor = "lightblue"; // Colore dell'ombra
            ctx.shadowBlur = 10; // Sfocatura dell'ombra
            ctx.fillStyle = "cyan";
        } else if (this.shot === "projEnemy") {
            ctx.shadowColor = "yellow"; // Colore dell'ombra
            ctx.shadowBlur = 10; // Sfocatura dell'ombra
            ctx.fillStyle = "orange";
        }
        super.draw(ctx);
        this.death();
        ctx.restore(); // Ripristina lo stato del contesto
    }

    move(){
        this.y = this.y - this.speed;
        this.outOfGame();
    }

    outOfGame(){
        if (this.y + this.height <= 0) {
            this.isAlive = false;
        }
    }

    death(){
        if (this.healthPoints <= 0){
            this.isAlive = false;
        }
    }
}