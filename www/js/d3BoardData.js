var d3BoardData = [
	{id: 0, x: 0.15, y: 0.14},
    {id: 1, x: 0.23, y: 0.10},
    {id: 2, x: 0.37, y: 0.08},
    {id: 3, x: 0.74, y: 0.09},
    {id: 4, x: 0.80, y: 0.10},
    {id: 5, x: 0.15, y: 0.18},
    {id: 6, x: 0.23, y: 0.33},
    {id: 7, x: 0.37, y: 0.31},
    {id: 8, x: 0.70, y: 0.23},
    {id: 9, x: 0.85, y: 0.18},
    {id: 10, x: 0.01, y: 0.49},
    {id: 11, x: 0.23, y: 0.47},
    {id: 12, x: 0.37, y: 0.37},
    {id: 13, x: 0.74, y: 0.42},
    {id: 14, x: 0.85, y: 0.44},
    {id: 15, x: 0.01, y: 0.63},
    {id: 16, x: 0.23, y: 0.57},
    {id: 17, x: 0.37, y: 0.52},
    {id: 18, x: 0.74, y: 0.51},
    {id: 19, x: 0.85, y: 0.65},
    {id: 20, x: 0.01, y: 0.67},
    {id: 21, x: 0.23, y: 0.81},
    {id: 22, x: 0.37, y: 0.73},
    {id: 23, x: 0.74, y: 0.69},
    {id: 24, x: 0.85, y: 0.72},
    {id: 25, x: 0.01, y: 0.99},
    {id: 26, x: 0.23, y: 0.86},
    {id: 27, x: 0.37, y: 0.89},
    {id: 28, x: 0.74, y: 0.94},
    {id: 29, x: 0.85, y: 0.99}
]

/*
var graphData = {
	 0: [5, 1],
	 1: [0, 5, 6, 7, 2],
	 2: [1, 7, 8, 3],
	 3: [2, 8, 9, 4],
	 4: [3, 9],
	 5: [6, 1, 0],
	 6: [10, 11, 12, 7, 1, 5],
	 7: [1, 6, 12, 13, 8, 2],
	 8: [2, 7, 13, 14, 9, 3],
	 9: [3, 8, 14, 4],
	 10: [15, 16, 11, 6],
	 11: [6, 10, 16, 17, 12],
	 12: [6, 11, 17, 13, 7],
	 13: [12, 17, 18, 14, 8, 7],
	 14: [13, 18, 19, 9, 8],
	 15: [20, 16, 10],
	 16: [10, 15, 20, 22, 17, 11],
	 17: [11, 16, 22, 23, 18, 13, 12],
	 18: [13, 17, 23, 19, 14],
	 19: [18, 23, 24, 14],
	 20: [21, 22, 16, 15],
	 21: [26, 27, 22, 20],
	 22: [20, 21, 27, 23, 17, 16],
	 23: [17, 22, 27, 28, 24, 19, 18],
	 24: [23, 28, 29, 19],
	 25: [27, 26],
	 26: [25, 27, 21],
	 27: [25, 26, 28, 23, 22, 21],
	 28: [29, 24, 23, 27],
	 29: [24, 28]
}


d3BoardData.forEach(function(d){
	d.neighbours = graphData[d.id];
})*/

var neighboursGenerated = false;

function generateNeighbourGraph(allCornerPoints){
	if ( neighboursGenerated ){
		return;
	}
	allCornerPoints.forEach(function(zoneCornerPoints,idx){
		var neighbours = [];
		//loop through the zone's corner points
		zoneCornerPoints.forEach(function(cornerPoint){
			//loop through other zones and find zones that have same corner point
			allCornerPoints.forEach(function(zcPoints2,idx2){
				if ( idx2 == idx){
					return;
				}

				zcPoints2.forEach(function(cp2){
					if ( cp2[0] == cornerPoint[0] && cp2[1] == cornerPoint[1]){
						neighbours.push(idx2);
						found = true;
						return;
					}
				})
			})
			
		})
		var uniqueNeighbours = []
		$.each(neighbours, function(i, el){
    		if($.inArray(el, uniqueNeighbours) === -1) uniqueNeighbours.push(el);
		});
		d3BoardData[idx].neighbours = uniqueNeighbours;
	})

	neighboursGenerated = true;
}