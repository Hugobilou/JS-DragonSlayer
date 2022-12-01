'use strict';   // Mode strict du JavaScript

/***************************************************************************/
/* ************************** FONCTIONS JEU ****************************** */
/***************************************************************************/
function dice(nbr, face){
    let sum = 0;
    for (let i = 0; i < nbr; i++){
        sum += Math.floor(Math.random() * (face - 1)) + 1
    }
    return sum;
}

function knightInit(playerClass){
    let initiative = dice(10,6);
    if ( playerClass == "voleur") initiative = initiative + (initiative * dice(1,6) / 100);
    if (initiative >= dice(10,6)) return true;
    else return false;
}

function knightAtk(difficulty, playerClass){
    let dmg = dice(3,6);
    if (difficulty == "facile") dmg = dmg + (dmg * dice(2,6) / 100);
    else if (difficulty == "difficile") dmg = dmg - (dmg * dice(1,6) / 100);
    if (playerClass == "mage") dmg = dmg + (dmg * dice(1,10) / 100);
    return Math.floor(dmg);
}

function dragonAtk(difficulty, playerClass){
    let dmg = dice(3,6);
    if (difficulty == "facile") dmg = dmg - (dmg * dice(2,6) / 100);
    else if (difficulty == "difficile") dmg = dmg + (dmg * dice(1,6) / 100);
    if (playerClass == "chevalier" ) dmg = dmg - (dmg * dice(1,10) / 100);
    return Math.floor(dmg);
}

function gameState(knightHP, dragonHP, knightHPInit, dragonHPInit){
    let knightImg = "knight";
    if (knightHP < knightHPInit * 30 / 100) knightImg = "knight-wounded";
    let dragonImg = "dragon";
    if (dragonHP < dragonHPInit * 30 / 100) dragonImg = "dragon-wounded";

    if (knightHP <= 0){
        document.write(`
            <div class="game-state">
                <figure class="game-state_player">
                    <img src="images/${knightImg}.png" alt="Chevalier">
                    <figcaption>Game Over</figcaption>
                </figure>
                <figure class="game-state_player">
                    <img src="images/${dragonImg}.png" alt="Dragon">
                    <figcaption><progress max="${dragonHPInit}" value="${dragonHP}"></progress>${dragonHP}PV</figcaption>
                </figure>
            </div>
            <footer>
                <h3>Fin de la partie</h3>
                <figure class="game-end">
                    <figcaption>Vous avez perdu le combat, le dragon vous a carbonisé !</figcaption>
                    <img src="images/dragon-winner.png" alt="Dragon vainqueur">
                </figure>
            </footer>`);
    }
    else if (dragonHP <= 0){
        document.write(`
            <div class="game-state">
                <figure class="game-state_player">
                    <img src="images/"${knightImg}.png" alt="Chevalier">
                    <figcaption><progress max="${knightHPInit}" value="${knightHP}"></progress>${knightHP}PV</figcaption>
                </figure>
                <figure class="game-state_player">
                    <img src="images/${dragonImg}.png" alt="Dragon">
                    <figcaption>Game Over</figcaption>
                </figure>
            </div>
            <footer>
                <h3>Fin de la partie</h3>
                <figure class="game-end">
                    <figcaption>Vous avez gagné le combat, le dragon a été vaincu !</figcaption>
                    <img src="images/knight-winner.png" alt="Dragon vainqueur">
                </figure>
            </footer>`);
    }
    else {
        document.write(`
            <div class="game-state">
                <figure class="game-state_player">
                    <img src="images/${knightImg}.png" alt="Chevalier">
                    <figcaption><progress max="${knightHPInit}" value="${knightHP}"></progress>${knightHP}PV</figcaption>
                </figure>
                <figure class="game-state_player">
                    <img src="images/${dragonImg}.png" alt="Dragon">
                    <figcaption><progress max="${dragonHPInit}" value="${dragonHP}"></progress>${dragonHP}PV</figcaption>
                </figure>
            </div>`
            );
    }
}

function gameRound(knightInit, knightAtk, dragonAtk, tour){
    if (knightInit){
        document.write(`
            <h3>Tour n°${tour}</h3>
            <figure class="game-round">
                <img src="images/knight-winner.png" alt="Chevalier vainqueur">
                <figcaption>Vous êtes le plus rapide, vous attaquez le dragon et lui infligez ${knightAtk} points de dommage !</figcaption>
            </figure>`)
    }
    else{
        document.write(`
            <h3>Tour n°${tour}</h3>
            <figure class="game-round">
                <img src="images/dragon-winner.png" alt="Dragon vainqueur">
                <figcaption>Le dragon prend l'initiative, vous attaque et vous inflige ${dragonAtk} points de dommage !</figcaption>
            </figure>`)
    }
}

function init(){
    do{
        difficulty = prompt("Difficulté ?").toLowerCase();
    }while(!(difficulty == "facile" || difficulty == "normal" || difficulty == "difficile"))

    do{
        playerClass = prompt("Choississez une classe entre: Chevalier, Voleur, Mage").toLowerCase();
    }while(!(playerClass == "chevalier" || playerClass == "voleur" || playerClass == "mage"))

    if (difficulty == "difficile") knightHP = 100 + dice(7,10);
    else knightHP = 100 + dice(10,10);

    if (difficulty == "facile") dragonHP = 100 + dice(5,10);
    else dragonHP = 100 + dice(10,10);
}

/***************************************************************************/
/* *************************** CODE PRINCIPAL **************************** */
/***************************************************************************/
let difficulty;
let playerClass;
let knightHP;
let dragonHP;

init();

const knightHPInit = knightHP;
const dragonHPInit = dragonHP;

gameState(knightHP, dragonHP, knightHPInit, dragonHPInit);

for (let tour = 1; knightHP > 0 && dragonHP > 0; tour++){
    let knightinit = knightInit(playerClass);
    let knightDmg = knightAtk(difficulty, playerClass);
    let dragonDmg = dragonAtk(difficulty, playerClass);
    if (knightinit) dragonHP -= knightDmg;
    else knightHP -= dragonDmg;
    gameRound(knightinit, knightDmg, dragonDmg, tour);
    gameState(knightHP, dragonHP, knightHPInit, dragonHPInit);
}