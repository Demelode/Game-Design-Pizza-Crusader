
/**
 * represents a region. 
 * each region has a number of resources it generates
 */
var Region = function(generator){
	this.generator = typeof generator !== 'undefined'? generator : 0;
	this.incomingDeliveries = [];
	this.playerId = null;
}

var GameBoard = function(){
	this.players = [];
	this.regions = [];
	for(i = 0;i<10;i++){
		this.regions.push(new Region(1))
	}
	this.currentRound = 1;
	this.numberOfRounds = 5;
}

GameBoard.prototype.assignDeliveries = function(playerId,regionId, numDeliveries){
	this.regions[regionId].incomingDeliveries[playerId] = numDeliveries;
}



GameBoard.prototype.endRound = function(){
	//update which region belongs to which player
	var self = this;
	this.regions.forEach(function(region){
		var owner = null;
		var ownerDeliveries = 0;
		region.incomingDeliveries.forEach(function(delivery,idx){
			if ( delivery > ownerDeliveries){
				owner = idx;
			}
		})

		if ( owner == null){
			return;
		}
		region.incomingDeliveries = [];

		if ( region.playerId != null ){
			self.players[region.playerId].numResources -= region.generator;
		}
		region.playerId = owner;

		self.players[region.playerId].numResources += region.generator;
	})


	//update game board with new data
}


GameBoard.prototype.isGameOver = function(playerId){
	var player = this.regions[0].player;
	var isOver = true;
	this.regions.forEach(function(region){
		if ( region.player != player){
			isOver = false;
			return false;
		}
	});

	return isOver;
}


gameBoard = new GameBoard();