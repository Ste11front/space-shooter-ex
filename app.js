let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

window.addEventListener('resize', ()=> { // Ridimensiona la canvas per schermo intero
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}, true);

let animate;
const player = new Player(canvasWidth / 2, canvasHeight / 2, 50, 50);
let allEnemies = [];
let enemyCooldown = 120;
let minibossCoolDown = 200;
let playerProjectiles = player.projectiles;

const gameOver = document.getElementById("game-over");
const gameOverBtn = document.getElementById("game-over-btn");
const hpBar = document.getElementById("hp-bar");
let hpWidth = 100 / player.healthPoints;

const scoreText = document.getElementById("score-text");
minibossProjectiles = []

document.addEventListener("DOMContentLoaded", function() { // Funzione che porta a caricare all'avvio il GameOver
    player.healthPoints = 0;
    let hpContainer = document.querySelector('.hp-container'); // Nasconde la barra della salute
    if (hpContainer) {
        hpContainer.style.visibility = "hidden";
    }

    // Cambia il testo di Game Over in Space Attack
    let gameOverText = document.querySelector('.inner-game-over h1');
    if (gameOverText) {
        gameOverText.innerHTML = "Space Attack";
    }
    
    // Aggiunge by Username
    let subGameOverText = document.createElement('h2');
    subGameOverText.innerHTML = "by Ste11front";

    // Aggiungi il nuovo elemento sotto il testo del game over
    gameOverText.parentNode.insertBefore(subGameOverText, gameOverText.nextSibling);
    
    // Cambia il testo del pulsante di Game Over in Press ENTER to Play
    let gameOverBtnText = document.getElementById('game-over-btn');
    if (gameOverBtnText) {
        gameOverBtnText.innerHTML = "Press <kbd>ENTER</kbd><br>to Play!";
    }
});

let state = "Play";

let bossCoolDown = 1000; // Tempo di attesa prima che il boss appaia
let bossSpawned = false; // Se il boss è già stato generato

let background = new Image();
background.src = "assets/space.png";
let background_y = 0;

gameOverBtn.addEventListener("click", () => {
    player.healthPoints = 10;
    player.projectiles = [];
    allEnemies = [];
    gameOver.style.display = "none";
    player.score = 0;
    player.x = canvasWidth / 2;
    player.y = canvasHeight / 2;

    let hpContainer = document.querySelector('.hp-container'); // Riespone la barra della salute
    if (hpContainer) {
        hpContainer.style.visibility = "";
    }
    // Ripristina il testo di Game Over
    let gameOverText = document.querySelector('.inner-game-over h1');
    if (gameOverText) {
        gameOverText.innerText = "Game Over";
    }
    let smallText = document.querySelector('.inner-game-over h2'); // Rimuove h2
    if (smallText) {
        smallText.remove();
    }
    // Ripristina il testo del pulsante di Game Over
    let gameOverBtnText = document.getElementById('game-over-btn');
    if (gameOverBtnText) {
        gameOverBtnText.innerHTML = "Press <kbd>ENTER</kbd><br>to Retry!";
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && state === "GameOver") {
        gameOverBtn.click();
    }
});

// Youtube
const youtubeBtn = document.getElementById("youtube-btn");
const youtubeIframe = document.getElementById("youtube-iframe");
let youtubePlayer;

function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-iframe', {
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        youtubePlayer.playVideo();
    }
}

youtubeBtn.addEventListener("click", () => {
    if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
        youtubePlayer.pauseVideo();
        youtubeBtn.innerHTML = "<kbd>M</kbd>\u00A0= Music 🔇";
    } else {
        youtubePlayer.playVideo();
        youtubeBtn.innerHTML = "<kbd>M</kbd>\u00A0= Music 🔊";
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "m") {
        youtubeBtn.click();
    }
});
// Youtube

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen(); 
        }
    }
}

function animation() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    animate = requestAnimationFrame(animation);
    gameStates();
    if (state === "Play") {
        loopBackground();
        if (player) {
            player.draw(ctx);
            player.control(canvasWidth, canvasHeight);
            playerProjectiles = player.projectiles;
        }
        
        enemyCooldown--;
        if (enemyCooldown <= 0) {
            enemySpawn();
            enemyCooldown = 120;
        }
        minibossSpawn();
        minibossProjectiles = [];
        allEnemies = allEnemies.filter((e) => e.isAlive);
        for (let i = 0; i < allEnemies.length; i++) {
            const enemy = allEnemies[i];
            enemy.draw(ctx);
            enemy.move(canvasHeight);
            if (enemy.projectiles) {
                minibossProjectiles.push(...enemy.projectiles);
            }
        }

        if(!bossSpawned && bossCoolDown <= 0){ // Se il boss non è stato ancora generato e il tempo di attesa è scaduto
            let xPos = canvasWidth/2 - 128; // Posizione del boss
            let boss = new Boss(xPos,-84*2,128,84); // Crea un nuovo oggetto Boss
            allEnemies.push(boss); // Aggiunge il boss all'array di nemici
            bossSpawned = true; // Imposta la variabile bossSpawned a true
        } else if (bossSpawned) { // Se il boss è stato generato
            bossCoolDown = 1000; // Reimposta il tempo di attesa del boss
            bossSpawned = false; // Reimposta la variabile bossSpawned a false
        }
        bossCoolDown--; // Decrementa il tempo di attesa del boss

        enemyCollision();
        
        let hpBar = document.getElementById('hp-bar'); // Funzione x cambio colore barra salute
        let hpWidth = 10; // Stesso numero dei punti salute
        if (player.healthPoints <= 1) {
            hpBar.style.backgroundColor = 'rgba(255, 13, 0, 0.544)'; // Rosso
        } else if (player.healthPoints <= 2) {
            hpBar.style.backgroundColor = 'rgba(255, 38, 0, 0.544)'; // Rosso chiaro
        } else if (player.healthPoints <= 4) {
            hpBar.style.backgroundColor = 'rgba(255, 255, 0, 0.544)'; // Giallo scuro
        } else if (player.healthPoints <= 6) {
            hpBar.style.backgroundColor = 'rgba(208, 255, 0, 0.544)'; // Giallo chiaro
        } else if (player.healthPoints <= 8) {
            hpBar.style.backgroundColor = 'rgba(123, 255, 0, 0.544)'; // Verde chiaro
        }
        else {
            hpBar.style.backgroundColor = 'rgba(0, 255, 0, 0.544)'; // Verde scuro
        }
        hpBar.style.width = hpWidth * player.healthPoints + "%";

        scoreText.innerText = "Score : \u00A0" + player.score;
        // recupera il punteggio migliore dal local storage all'inizio del gioco
        let bestScore = localStorage.getItem('bestScore') || 0;
        const bestScoreText = document.getElementById("best-score-text");
        bestScoreText.innerText = "Record : \u00A0" + bestScore;
        // aggiorna il punteggio migliore quando il giocatore ottiene un nuovo record
        if (player.score > bestScore) {
            bestScore = player.score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreText.innerText = "Record : \u00A0" + bestScore;
        }

    } else if (state === "GameOver") {
        gameOver.style.display = "flex";
    }
}

function enemySpawn() {
    const randomX = Math.random() * (canvasWidth - 50);
    let enemy = new BaseEnemy(randomX, -50, 50, 50);
    allEnemies.push(enemy);
}

function minibossSpawn() {
    minibossCoolDown--;
    if (minibossCoolDown <= 0) {
        let xPos = Math.random() < 0.5 ? 0 - 128 : canvasWidth;
        let miniboss = new Miniboss(xPos, 120, 128, 84);
        miniboss.score = 1000;
        miniboss.speed = xPos < 0.5 ? 2 : -2;
        allEnemies.push(miniboss);
        minibossCoolDown = 200;
    }
}

function enemyCollision() {
    let playerAssets = [player, ...playerProjectiles];
    let enemyAssets = [...allEnemies, ...minibossProjectiles];
    for (let i = 0; i < playerAssets.length; i++) {
        const pA = playerAssets[i];
        for (let j = 0; j < enemyAssets.length; j++) {
            const enemy = enemyAssets[j];
            if (
                enemy.x < pA.x + pA.width &&
                enemy.x + enemy.width > pA.x &&
                enemy.y < pA.y + pA.height &&
                enemy.y + enemy.height > pA.y
            ) {
                enemy.healthPoints--;
                pA.healthPoints--;
                enemy.death();
                if (!enemy.isAlive && enemy.score && !pA.isPlayer) {
                    player.score += enemy.score;
                }
            }
        }
    }
}

function gameStates() {
    switch (state) {
        case "Play":
            if (player.healthPoints <= 0) {
                state = "GameOver";
            }
        break;
        case "GameOver":
            if (player.healthPoints > 0) {
                state = "Play";
            }
        break;
    
        default:
            break;
    }
}

function loopBackground() {
    ctx.drawImage(background, 0, background_y, canvasWidth, canvasHeight);
    ctx.drawImage(background, 0, background_y - canvasHeight, canvasWidth, canvasHeight);
    background_y++;
    if (background_y >= canvasHeight) {
        background_y = 0;
    }
}

animation();