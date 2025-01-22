// factory function for creating players
function createPlayer(name, type) {
    // make name and type private to prevent accidentally changing them
    const getName = () => {return name};
    const getType = () => {return type};
    return {getName, getType}
}


function startGame(gameBoard) {

    // get player names (hard-coded for now)
    const name1 = "Alice"; 
    const name2 = "Bob"; 

    // create two players
    const player1 = createPlayer(name1, "O");
    const player2 = createPlayer(name2, "X");
    console.log(`Player 1 name: ${player1.getName()}, type: ${player1.getType()}`);    
    console.log(`Player 2 name: ${player2.getName()}, type: ${player2.getType()}`); 


    console.log("game board: ", gameBoard);
    gameBoard.display();

    const playRound = (position) => {
        gameBoard.play(current_player, position);
        gameBoard.display();
    };

    const symbolConvert = (type) => {
        switch (type) {
            case 'O':
                return "circle";
            
            case 'X':
                return "cross";
        }
    };

    // initialize current turn number of current player
    let current_turn = 0;
    let current_player = (current_turn%2 == 0) ? player1 : player2;
    player_turn.textContent = `${current_player.getName()} make your move`;
    let gameOver = false;

    // attach event listener to board grid to register clicks
    container.addEventListener("click", (e) => {
        const target = e.target;
        const position = target.id;
        const num_classes = target.classList.length;
        console.log(`Clicked on cell# ${position}, class list: ${target.classList}`);

        // Note: empty cell has class list length of 1
        
        // play a round if current player fills an empty cell
        if (num_classes === 1) {
            // update grid to display the filled cell
            target.classList.add(symbolConvert(current_player.getType()));
            console.log(`Updated class list: ${target.classList}`)

            playRound(position);
            const won = gameBoard.checkGameWin();
            if (won !== false) {
                gameOver = true;
                console.log(`${current_player.getName()} has won the game! Win pattern: ${won}`);
                player_turn.textContent = `Game over. ${current_player.getName()} wins!`;
                // highlight the win pattern cells
                won.forEach( (position) => {
                   const cell = document.querySelector(`[id='${position}']`); // query selector with number id requires some extra work..
                   cell.classList.add("win"); 
                });
                

            };
            current_turn++;
            
            // check if all slots filled
            if (current_turn === 9) {
                gameOver = true;
                console.log(`And it's a draw!`);
                player_turn.textContent = `Game over. It's a draw!`;
            }
            
            if(!gameOver) {
                // pass the turn to other player
                current_player = (current_turn%2 === 0) ? player1 : player2;
                player_turn.textContent =  `${current_player.getName()} make your move`;
            } else {
                // give option to restart the game... maybe with modal dialog form
            } 
                    
        } else {
            console.log("Invalid move. Board position already filled!");
        }
        

    });
    

}


const container = document.querySelector(".container");
const player_turn = document.querySelector(".player-turn");
const restart = document.querySelector(".restart-btn");


// create game-board
const gameBoard = (function () {
    // create empty game grid, will make it private
    let grid = [];
    for (let i = 0; i < 9; i++){
        grid.push("-");
    } 

    const display = () => {
        console.log(`\n${grid[0]} | ${grid[1]} | ${grid[2]}\n${grid[3]} | ${grid[4]} | ${grid[5]}\n${grid[6]} | ${grid[7]} | ${grid[8]}\n`);
    };

    const play = (player, position) => {
        if (grid[position] === "-"){
            grid[position] = player.getType();
            return true;
        } else {
            console.log("Invalid move. Board position already filled!");
            return false;function eraseGrid() {
            }
        }
    };

    const checkGameWin = () => {
        // check for win pattern (same symbol along any column/row/diagonal)

        // check rows

        if (grid[0] === grid[1] && grid[0] === grid[2] && !(grid[0]+grid[1]+grid[2]).includes("-")) {
            return [0,1,2];
        }    
        if (grid[3] === grid[4] && grid[3] === grid[5] && !(grid[3]+grid[4]+grid[5]).includes("-")) {
            return [3,4,5];
        }    
        if (grid[6] === grid[7] && grid[6] === grid[8] && !(grid[6]+grid[7]+grid[8]).includes("-")) {
            return [6,7,8];
        }  

        // check columns
        if (grid[0] === grid[3] && grid[0] === grid[6] && !(grid[0]+grid[3]+grid[6]).includes("-")) {
            return [0,3,6];
        } 
        if (grid[1] === grid[4] && grid[1] === grid[7] && !(grid[1]+grid[4]+grid[7]).includes("-")) {
            return [1,4,7];
        } 
        if (grid[2] === grid[5] && grid[2] === grid[8] && !(grid[2]+grid[5]+grid[8]).includes("-")) {
            return [2,5,8];
        } 
        
        // check diagonals
        if (grid[0] === grid[4] && grid[0] === grid[8] && !(grid[0]+grid[4]+grid[8]).includes("-")) {
            return [0,4,8];
        } 
        if (grid[2] === grid[4] && grid[2] === grid[6] && !(grid[2]+grid[4]+grid[6]).includes("-")) {
            return [2,4,6];
        } 

        return false;
    };

    const eraseGrid = () => {
        // reset grid array and remove html class for the cross/circle images
        for (let i = 0; i < 9; i++){
            grid[i] = "-";
            const cell = document.querySelector(`[id='${i}']`);
            cell.classList.remove("cross", "circle", "win");
        } 
        console.log("Grid erased!");
        display();
    };

    return {display, play, checkGameWin, eraseGrid}

}) (); 



// add event listener for triggering game restart
restart.addEventListener("click", (e) => {
    // erase the board and restart game
    gameBoard.eraseGrid();
    startGame(gameBoard);
    console.log("Game restarted!");
});


console.log("Begin game.")
startGame(gameBoard);