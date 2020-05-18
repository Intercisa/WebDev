

var scores, roundScore, activePlayer, zeroDiceDOM, oneDiceDOM, gamePlaying, globalScore ;

init();


document.querySelector('.btn-roll').addEventListener('click', function(){
    if(gamePlaying){
        //1. Random number 
        let dice1 = Math.floor(Math.random()*6)+1;
        let dice2 = Math.floor(Math.random()*6)+1;
        
        //erase the global score for the current player
        doubleSix(dice1, dice2);
        
        //2. Display the result 

        zeroDiceDOM.style.display = 'block';
        oneDiceDOM.style.display = 'block';
        
        zeroDiceDOM.src = 'dice-' + dice1 + '.png'; 
        oneDiceDOM.src = 'dice-' + dice2 + '.png'; 

        //3. Update the round score IF ther rolled number was NOT a 1
        if(dice1 !== 1 || dice2 !== 1){
            roundScore += (dice1 + dice2);
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }else{

         switchPlayer();

        }
    }

});


document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying){
        scores[activePlayer] += roundScore;
        document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];

        if(scores[activePlayer] >= globalScore){
            document.querySelector('#name-'+activePlayer).textContent = 'WINNER';
            
            zeroDiceDOM.style.display = 'none';
            oneDiceDOM.style.display = 'none';
            
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            gamePlaying = false;
        }else{
            switchPlayer();
        }
    }
});


function switchPlayer(){
      
        activePlayer = activePlayer=== 0 ? 1 : 0;
        
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        
        /*
        document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
        document.querySelector('.player-'+activePlayer+'-panel').classList.add('active');
        */
        
        roundScore = 0;

        document.getElementById('current-0').textContent = '0';
        document.getElementById('current-1').textContent = '0';
         
         zeroDiceDOM.style.display = 'none';
         oneDiceDOM.style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);


function init(){
    
    gamePlaying = true;
    globalScore = 100;
    
 
    
    scores = [0,0];
    activePlayer = 0;
    roundScore = 0;
    
    zeroDiceDOM = document.querySelector('.dice-0');
    oneDiceDOM = document.querySelector('.dice-1');

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    zeroDiceDOM.style.display = 'none';
    oneDiceDOM.style.display = 'none';

    current1 = document.getElementById('name-0').textContent = 'Player 1';
    current1 = document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');   
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    document.querySelector('.player-0-panel').classList.add('active');

}


function doubleSix(dice1, dice2){

    if(dice1 === 6 && dice2 === 6){
            scores[activePlayer] = 0;
            document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];
            switchPlayer();    
    }
}

document.querySelector('.btn-hold').addEventListener('click', function(){
    globalScore = document.getElementById('input').value;
    console.log(globalScore);
});

/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/