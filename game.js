//jshint esversion: 6
let board = new Array(9).fill(0);
let gameStarted = 1;
let human = 1;
let ai = -1;
const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],  //rows
  [0,3,6], [1,4,7], [2,5,8],  //cols
  [0,4,8], [2,4,6]            //diags
];


$(".cell").on("click", function(event) {
  let cell = event.target.id;
  if (!board[cell] && gameStarted) {
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
  if (player === ai) $("h1").text("You lose."); else
  if (checkDraw(board)) $("h1").text("Draw!");
  gameStarted = 0;
  setTimeout(function() {
    $(".game-board").hide();
    $(".play-again").css("display", "block");
  }, 1300);

}

$(".play-again").on("click", function(event) {
  board = new Array(9).fill(0);
  $(".cell").text("");
  $(".game-board").show();
  $(".play-again").css("display", "none");
  $("h1").text("Tic Tac Toe");
  gameStarted = 1;
});

function minimax(board, player) {
  let playableMoves = getPlayableMoves(board);

  if (checkWin(board, ai)) return {score: 10}; else
  if (checkWin(board, human)) return {score: -10}; else
  if (!playableMoves.length) return {score: 0};

  var moves = [];
  for (let playable of playableMoves) {
    var move = {};
    move.pos = playable;
    board[move.pos] = player;
    move.score =  minimax(board, -player).score;
    board[move.pos] = 0;
    if (player*move.score === -10)
      return move;
    else
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === ai) {
    bestScore = -1000;
    for (let move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  } else {
      bestScore = 1000;
      for (let move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
  }
  return bestMove;
}
