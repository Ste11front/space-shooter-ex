class BaseEnemy extends GameObject{
    constructor(x, y, width, height){
        super(x, y, width, height);
        this.speed = 3;
        this.isAlive = true;
        this.healthPoints = 1;
        this.score = 100;
        // Integrazione asset
        this.img = new Image();
        this.img.src = 'assets/base-enemy.gif';
    }

    draw(ctx){
        ctx.save(); // Salva stato
        ctx.shadowColor = "red"; // Effetto di luce
        ctx.shadowBlur = 10; // Effetto sfocatura
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // Disegna l'immagine solo se esiste
        }
        ctx.restore(); // Ripristina stato per evitare modifiche ad altri oggetti
        // ctx.fillStyle = "red";
        // super.draw(ctx);
    }

    move(canvasHeight){
        this.y = this.y + this.speed;
        this.outOfGame(canvasHeight);
    }

    outOfGame(canvasHeight){
        if (this.y >= canvasHeight) {
            this.isAlive = false;
        }
    }

    death(){
        if (this.healthPoints <= 0){
            this.isAlive = false;
        }
    }
}