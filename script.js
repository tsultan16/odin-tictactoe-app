// factory function for creating players
function createPlayer(name, type) {
    // make name and type private to prevent accidentally changing them
    const getName = () => {return name};
    const getType = () => {return type};
    return {getName, getType}
}

function startGame() {

    // get player names (hard-coded for now)
    const name1 = "Alice"; 
    const name2 = "Bob"; 

    // create two players
    const player1 = createPlayer(name1, "O");
    const player2 = createPlayer(name2, "X");
    console.log(`Player 1 name: ${player1.getName()}, type: ${player1.getType()}`);    
    console.log(`Player 2 name: ${player2.getName()}, type: ${player2.getType()}`); 


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
                return false;
            }
        };

        const checkGameWin = () => {
            // check for win pattern (same symbol along any column/row/diagonal)

            // check rows
            let foundPattern = false;

            if (grid[0] === grid[1] && grid[0] === grid[2] && !(grid[0]+grid[1]+grid[2]).includes("-")) {
                return true;
            }    
            if (grid[3] === grid[4] && grid[3] === grid[5] && !(grid[3]+grid[4]+grid[5]).includes("-")) {
                return true;
            }    
            if (grid[6] === grid[7] && grid[6] === grid[8] && !(grid[6]+grid[7]+grid[8]).includes("-")) {
                return true;
            }  

            // check columns
            if (grid[0] === grid[3] && grid[0] === grid[6] && !(grid[0]+grid[3]+grid[6]).includes("-")) {
                return true;
            } 
            if (grid[1] === grid[4] && grid[1] === grid[7] && !(grid[1]+grid[4]+grid[7]).includes("-")) {
                return true;
            } 
            if (grid[2] === grid[5] && grid[2] === grid[8] && !(grid[2]+grid[5]+grid[8]).includes("-")) {
                return true;
            } 
         
            // check diagonals
            if (grid[0] === grid[4] && grid[0] === grid[8] && !(grid[0]+grid[4]+grid[8]).includes("-")) {
                return true;
            } 
            if (grid[2] === grid[4] && grid[2] === grid[6] && !(grid[2]+grid[4]+grid[6]).includes("-")) {
                return true;
            } 

            return false;

        };


        return {display, play, checkGameWin}

    }) (); 

    console.log("game board: ", gameBoard);
    gameBoard.display();

    const playRound = (position) => {
        // current_player = (current_turn%2 == 0) ? player1 : player2;
        //let done = false;
        // loop until user gives valid input position
        //do {
        //    const position = window.prompt(`${current_player.getName()} choose your move position.`);
        gameBoard.play(current_player, position);
        //} while(!done);

        gameBoard.display();
        // return current_player;
    };

    const symbolConvert = (type) => {
        switch (type) {
            case 'O':
                return "circle";
            
            case 'X':
                return "cross";
        }
    };

    // let gameOver = false;
    // while(!gameOver){
    //     const p = playRound();
    //     const won = gameBoard.checkGameWin();
    //     if (won) {
    //         gameOver = true;
    //         console.log(`${p.getName()} has won the game!`);
    //     };

    //     // check if all slots filled
    //     if (current_turn === 9) {
    //         gameOver = true;
    //         console.log(`And it's a draw!`);
    //     }
    // }

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
            if (won) {
                gameOver = true;
                console.log(`${current_player.getName()} has won the game!`);
                player_turn.textContent = `Game over. ${current_player.getName()} wins!`;
            };
    
            // check if all slots filled
            if (current_turn === 9) {
                gameOver = true;
                console.log(`And it's a draw!`);
                player_turn.textContent = `Game over. It's a draw!`;
            }

            if(!gameOver) {
                // pass the turn to other player
                current_turn++;
                current_player = (current_turn%2 == 0) ? player1 : player2;
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



console.log("Begin game.")
startGame();