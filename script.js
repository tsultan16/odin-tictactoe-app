// factory function for creating players
function createPlayer(name, type) {
    // make name and type private to prevent accidentally changing them
    const getName = () => {return name};
    const getType = () => {return type};
    return {getName, getType}
}


function startGame(gameBoard, player1, player2) {

    // reset game board state
    gameBoard.resetGrid();
    gameBoard.current_turn = 0;
    gameBoard.gameOver = false;
    gameBoard.current_player = (gameBoard.current_turn%2 == 0) ? player1 : player2;
    console.log("game board: ", gameBoard);
    gameBoard.display();

    // make sure game board is visible
    container.style.visibility = 'visible';

    player_turn.textContent = `${gameBoard.current_player.getName()} make your move`;


}


const container = document.querySelector(".container");
const player_turn = document.querySelector(".player-turn");
const restart = document.querySelector(".restart-btn");
const form_confirm_btn = document.querySelector("#confirm-btn"); 
const form_input_player1 = document.querySelector("#player1");
const form_input_player2 = document.querySelector("#player2");
const form_invalid_msg = document.querySelector("#invalid-msg");
const form = document.querySelector(".start-form");
const game_container = document.querySelector(".game-container");


// add event listener for game start form confirm
form_confirm_btn.addEventListener("click", (event) => {
    event.preventDefault(); // We don't want to submit this fake form
    
    // get user names from form input
    const name1 = form_input_player1.value;
    const name2 = form_input_player2.value;   
    console.log("Form input: ", name1, name2);
 
    if (name1 === "" || name2 === "") {
        // show invalid input message
        form_invalid_msg.textContent = "Invalid input. All fields required!";
        form_invalid_msg.style.color = "red";
    } else {

        // form_invalid_msg.textContent = "";
        // form_input_player1.value = "";
        // form_input_player2.value = ""; 

        // remove the form
        form.remove();

        // display the game container, then start the game
        game_container.style.visibility = 'visible';
        startMain(name1, name2);
    }

});


function startMain(name1, name2) {
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
        let current_turn = 0;
        let gameOver = false;
        // give first turn to player 1
        let current_player = (current_turn%2 == 0) ? player1 : player2;

        const display = () => {
            console.log(`\n${grid[0]} | ${grid[1]} | ${grid[2]}\n${grid[3]} | ${grid[4]} | ${grid[5]}\n${grid[6]} | ${grid[7]} | ${grid[8]}\n`);
        };
    
        const play = (position, player) => {
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
    
        const resetGrid = () => {
            // reset grid array and remove html class for the cross/circle images
            for (let i = 0; i < 9; i++){
                grid[i] = "-";
                const cell = document.querySelector(`[id='${i}']`);
                cell.classList.remove("cross", "circle", "win");
            } 

            console.log("Grid has been reset!");
            display();
        };
    
        return {current_turn, gameOver, current_player, display, play, checkGameWin, resetGrid}
    
    }) ();

    const symbolConvert = (type) => {
        switch (type) {
            case 'O':
                return "circle";
            
            case 'X':
                return "cross";
        }
    };


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
            target.classList.add(symbolConvert(gameBoard.current_player.getType()));
            console.log(`Updated class list: ${target.classList}`)

            console.log(`Playing a round, Current turn: ${gameBoard.current_turn}, Current player: ${gameBoard.current_player}`);
            gameBoard.play(position, gameBoard.current_player);
            gameBoard.display();
            gameBoard.current_turn++;
            const won = gameBoard.checkGameWin();
            if (won !== false) {
                gameBoard.gameOver = true;
                console.log(`${gameBoard.current_player.getName()} has won the game! Win pattern: ${won}`);
                player_turn.textContent = `${gameBoard.current_player.getName()} wins!`;
                // highlight the win pattern cells
                won.forEach( (position) => {
                    const cell = document.querySelector(`[id='${position}']`); // query selector with number id requires some extra work..
                    cell.classList.add("win"); 
                });
                
            };
            
            // check if all slots filled
            if (gameBoard.current_turn === 9 && won === false) {
                gameBoard.gameOver = true;
                console.log(`And it's a draw!`);
                player_turn.textContent = `It's a draw!`;
            }
            
            if(!gameBoard.gameOver) {
                // pass the turn to other player
                gameBoard.current_player = (gameBoard.current_turn%2 === 0) ? player1 : player2;
                console.log(`Passed turn to ${gameBoard.current_player.getName()}`);
                player_turn.textContent =  `${gameBoard.current_player.getName()} make your move`;
            } else {
                // hide board to prevent further inputs
                container.style.visibility = 'hidden';
                player_turn.textContent = player_turn.textContent + " Game Over. Click Restart to play again.";
            } 
                    
        } else {
            console.log("Invalid move. Board position already filled!");
        }
    
    });
    
    // add event listener for triggering game restart
    restart.addEventListener("click", (e) => {

        // display the game container, then start the game
        game_container.style.visibility = 'visible';
        
        console.log("Game restarted!");
        startGame(gameBoard, player1, player2);
    });
    
    
    console.log("Begin game.")
    startGame(gameBoard, player1, player2);

}
