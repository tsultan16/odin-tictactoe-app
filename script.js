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
            console.log(`${grid[0]} | ${grid[1]} | ${grid[2]}\n${grid[3]} | ${grid[4]} | ${grid[5]}\n${grid[6]} | ${grid[7]} | ${grid[8]}`);
        };

        const play = (player, position) => {
            grid[position] = player.getType();
        };


        return {display, play}

    }) (); 
    console.log("game board: ", gameBoard);
    gameBoard.display();


}

startGame();