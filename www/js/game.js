var game = {};
	
game.page = {
	'LOAD': '#page-play-game',
	'PRE': '#page-game-pre-round',
	'ROUND': '#page-game-round',
	'POST': '#page-game-post',
	'END': '#page-game-end'
}

game.isInitialized = false;
game.currentRound = 0;

game.newGame = function(){
	game.currentState = 'PRE';
	$.mobile.changePage(game.page['PRE']);
	game.currentRound = 1;
	gameBoard = new GameBoard();
	initializePlayers();
};

/* debug variable */
game.paused = false;

game.initialize = function(){
	if ( game.isInitialized ){
		return;
	}
	game.isInitialized = true;
	function pageLoadHandler(id,callback){
		$(document).on("pageshow",id,callback);
	}

	function countDown(startTime,callback,endCallback){
		var timeRemaining = startTime;
		var interval = setInterval(function(){
			callback(timeRemaining);

			if( !game.paused ){
				timeRemaining--;
				if ( timeRemaining < 0){
					clearInterval(interval);
					endCallback();
				}
			}


		},1000)
	}

	$("#play-game").click(function(){
		game.newGame();
	})


	
	/* round start function */
	pageLoadHandler(game.page['PRE'],function(event){
		countDown(5,
			function(time){
				$("#pre-round-timer").text(time);	
			},
			function(){
				$.mobile.changePage(game.page['ROUND']);
			}
		)
	})

	$("#btn-deliver").click(function(){
		currentPlayer.assignDelivery($("#in-deliver-region").val())
	})

	/* ongoing round function */
	pageLoadHandler(game.page['ROUND'],function(event){
		$("#round-current-round").text(game.currentRound);
		countDown(5,
			function(time){
				$("#round-timer").text(time);	
				$("#debug-info").text(JSON.stringify(gameBoard,null,4))
			},
			function(){
				$.mobile.changePage(game.page['POST']);
			}
		)
	})

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/* end of round function */
	pageLoadHandler(game.page['POST'],function(event){
		var region = getRandomInt(0,gameBoard.regions.length-1);
		console.log(region)

		botPlayer.assignDelivery(region,1);

		gameBoard.endRound();
		//make bot do something here
		
		console.log(gameBoard);
		countDown(5,
			function(time){
				$("#post-round-timer").text(time);		
			},
			function(){
				game.currentRound++;
				//TODO: check if any winners
				if ( game.currentRound >= 3 ){
					$.mobile.changePage(game.page['END']);
				}else{
					$.mobile.changePage(game.page['PRE']);
				}
			}
		)
	})

};