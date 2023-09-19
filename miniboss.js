class Miniboss extends BaseEnemy{
    constructor(x, y, width, height){
        super(x, y, width, height);
        this.speed = 2;
        this.projectiles = [];
        this.attackCD = 30;
        this.healthPoints = 12;
        // Integrazione asset
        this.img = new Image();
        this.img.src = 'assets/miniboss.gif';
    }

    draw(ctx){
        // ctx.fillStyle = "red";
        super.draw(ctx);
        this.attackCD--;

        this.projectiles = this.projectiles.filter(p => p.isAlive);
        this.projectiles.forEach(p => {
            p.draw(ctx);
            p.move();
        })

        this.baseAttack();
    }

    move(){
        this.x = this.x + this.speed;
    }

    baseAttack(){
        if (this.attackCD <= 0) {
            let projectile = new Projectile((this.x+this.width/2) - 2.5, (this.y + this.height), 5, 20, "projEnemy");
            projectile.speed = -15;
            this.projectiles.push(projectile);
            this.attackCD = 30;
        }
    }

    death(){
        super.death();
    }
}