
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
	for(i = 0;i<d3BoardData.length;i++){
		this.regions.push(new Region(1))
	}
	this.currentRound = 1;
	this.numberOfRounds = 30;
}

GameBoard.prototype.assignDeliveries = function(playerId,regionId, numDeliveries){
	var currentNumDeliveriesByPlayer = this.regions[regionId].incomingDeliveries[playerId];
	if ( currentNumDeliveriesByPlayer == null){
		currentNumDeliveriesByPlayer = 0;
	} 
	currentNumDeliveriesByPlayer++;
	this.regions[regionId].incomingDeliveries[playerId] = currentNumDeliveriesByPlayer;
}

GameBoard.prototype.removeDeliveries = function(playerId, regionId){
	var incomingDeliveriesArray = this.regions[regionId].incomingDeliveries;
	if ( incomingDeliveriesArray[playerId] == null){
		return 0;
	}

	this.regions[regionId].incomingDeliveries[playerId]--;
	return 1;

}

GameBoard.prototype.getOwnedRegions = function(playerId){
	var playerRegions = [];
	this.regions.forEach(function(region,idx){
		if ( region.playerId == playerId){
			playerRegions.push(idx);
		}
	});

	return playerRegions;
}

GameBoard.prototype.canDeliver = function(playerId, regionId){
	var playerRegions = this.getOwnedRegions(playerId);


	for(i =0;i<playerRegions.length;i++){
		var r = playerRegions[i];
		if( d3BoardData[r].neighbours.indexOf(regionId) > -1 ){
			return true;
		}
	}
	
	return false;

}

GameBoard.prototype.numFranchies = function(){
	var num = 0;
	var self = this;
	this.players.forEach(function(player){
		if ( self.getOwnedRegions(player.id).length > 0 ){
			num++;
		}
	})
	return num;
}


GameBoard.prototype.endRound = function(){
	//update which region belongs to which player
	log("end round called");
	var self = this;
	this.currentRound++;

	//reset all player's resources to 0
	this.players.forEach(function(p){
		p.numResources = 0;
	});

	//calculate new owners of regions and assign resources
	this.regions.forEach(function(region){
		
		//update owner based on deliveries
		var owner = region.playerId;
		var ownerDeliveries = 0;
		region.incomingDeliveries.forEach(function(delivery,idx){
			if ( delivery > ownerDeliveries){
				owner = idx;
			}
		});

		region.incomingDeliveries = [];
		//update owner
		region.playerId = owner;

		if ( region.playerId == null){
			return;
		}
		//assign resources
		self.players[region.playerId].numResources += region.generator;
	})


	//update game board with new data
}


GameBoard.prototype.isGameOver = function(){
	if ( this.currentRound >= this.numberOfRounds){
		return true;
	}

	var player = this.regions[0].playerId;
	return this.regions.every(function(region){
		return region.playerId == player;
	});

}

GameBoard.prototype.getWinner = function(){
	
	var numRegionsByPlayer = [];
	this.regions.forEach(function(region){
		if ( region.playerId != null){
			var val = numRegionsByPlayer[region.playerId];
			if ( val == null){
				val = 1;
			}else{
				val++;
			}
			numRegionsByPlayer[region.playerId] = val;
		}
	});

	var winner = null;
	var numberOfRegions = 0;

	numRegionsByPlayer.forEach(function(num,i){
		if(num>numberOfRegions){
			winner = i;
		}
		numberOfRegions = num;
	})


	return winner == null ? null: this.players[winner];

}

GameBoard.prototype.getOwner = function(regionId){
	var playerId = this.regions[regionId].playerId;
	return playerId == null? null: this.players[playerId]
}

GameBoard.prototype.getNumberOfDeliveries = function(regionId){
	var incomingDeliveriesArray = this.regions[regionId].incomingDeliveries;
	var incomingDeliveries = incomingDeliveriesArray[currentPlayer.id];

	return incomingDeliveries == null? 0: incomingDeliveries;
}

gameBoard = new GameBoard();
