//jshint esversion: 6
let board = new Array(9).fill(0);
let human = 1;
let ai = -1;
const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],  //rows
  [0,3,6], [1,4,7], [2,5,8],  //cols
  [0,4,8], [2,4,6]            //diags
];


$(".cell").on("click", function(event) {
  let cell = event.target.id;
  if (!board[cell]) {
    turn(cell, human);
    if (checkWin(board, human) || checkDraw(board)) endGame(human);
    else {
      turn(minimax(board, ai).pos, ai);
      if (checkWin(board, ai) || checkDraw(board)) endGame(ai);
    }
  }
});

function turn(cell, player) {
  board[cell] = player;
  let placeMarker = (player === 1) ? $('#'+cell).text('X') : $('#'+cell).text('O');
}

function checkWin(board, player) {
  let sums = winConditions.map(a => a.reduce((acc, i) => acc + board[i], 0));
  return sums.some(x => x === 3*player);
}

function getPlayableMoves(board) {
  return board.reduce((a, e, i) => ((!e) && a.push(i), a), []);
}

function checkDraw(board) {
  return getPlayableMoves(board).length ? false : true;
}

function endGame(player) {
  if (player === ai || checkWin(board, ai)) $("h1").text("You lose.");
  // if (player === human || checkWin(board, human))$("h1").text("You win!"); else //should be unreachable
  else $("h1").text("Draw!");
}

function copyBoard(board) {
    return [...board];
}


function minimax(board, player) {
  if (checkDraw(board)) return {score: 0}; else
  if (checkWin(board, ai)) return {score: 10}; else
  if (checkWin(board, human)) return {score: -10};

  let playableMoves = getPlayableMoves(board);
  var moves = [];
  let best = {score: player*-11};

  for (let i=0; i<playableMoves.length; i++) {
    var move = {};
    move.pos = playableMoves[i];
    board[move.pos] = player;

    if (player === ai)
      move.score = minimax(board, human).score;
    else
      move.score =  minimax(board, ai).score;
    board[move.pos] = 0;

    if (-player*move.score === 10)
      return move;
    else {
      if (player === ai) {
        if (move.score > best.score)
          best.score = move.score;
          best.pos = move.pos;
        }
      else
        if (move.score < best.score);
        best.score = move.score;
        best.pos = move.pos;}
  }
  return best;
}
