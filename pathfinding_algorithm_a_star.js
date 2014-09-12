var Pathfinding_Algorithm_A_Star = function()
{
	var openset = null;
	
	var closedset = null;
	var g_scores = null;
	var f_scores = null;
	var camefrom = null;
	var path = null;
};

Pathfinding_Algorithm_A_Star.prototype.distance = function(p1, p2)
{
	var x = p2.x - p1.x;
	var y = p2.y - p1.y;
	var z = p2.z - p1.z;
	
	var d = Math.sqrt(x*x + y*y + z*z);
	return d;
}

Pathfinding_Algorithm_A_Star.prototype.heuristic = function(p, goal)
{
	return this.distance(p, goal) * 10;
}

Pathfinding_Algorithm_A_Star.prototype.init = function(finder)
{
	this.openset = [];
	this.openset.push(finder._pStart);
	
	this.closedset = [];
	this.g_scores = [];
	this.f_scores = [];
	this.camefrom = [];
	for(var x = 0; x < finder._graph.length; ++x)
	{
		var closedsetY = [];
		var g_scoresY = [];
		var f_scoresY = [];
		var camefromY = [];
		for(var y = 0; y < finder._graph[x].length; ++y)
		{
			var closedsetZ = [];
			var g_scoresZ = [];
			var f_scoresZ = [];
			var camefromZ = [];
			for(var z = 0; z < finder._graph[x][y].length; ++z)
			{
				closedsetZ.push(false);
				g_scoresZ.push(null);
				f_scoresZ.push(null);
				camefromZ.push(null);
			}
			closedsetY.push(closedsetZ);
			g_scoresY.push(g_scoresZ);
			f_scoresY.push(f_scoresZ);
			camefromY.push(camefromZ);
		}
		this.closedset.push(closedsetY);
		this.g_scores.push(g_scoresY);
		this.f_scores.push(f_scoresY);
		this.camefrom.push(camefromY);
	}
	
	var p = finder._pStart
	this.g_scores[p.x][p.y][p.z] = 0;
	this.f_scores[p.x][p.y][p.z] = 0 + this.heuristic(finder._pStart, finder._pGoal);
}

Pathfinding_Algorithm_A_Star.prototype.tick = function(finder)
{
	if(this.openset == null)
	{
		this.init(finder);
	}
	
	if(this.openset.length == 0)
	{
		console.debug("A* Search: Could not find path");
		return Pathfinding.NOT_FOUND;
	}
	
	/* Pop node in openset with lowest f_score */
	var lowestScore = 0;
	var lowestScoreIndex = 0;
	for(var i  = 0; i < this.openset.length; ++i)
	{
		var p = this.openset[i];
		var f = this.f_scores[p.x][p.y][p.z];
		if(f < lowestScore || i == 0)
		{
			lowestScore = f;
			lowestScoreIndex = i;
		}
	}
	var p = this.openset[lowestScoreIndex];
	this.openset.splice(lowestScoreIndex, 1);
	this.closedset[p.x][p.y][p.z] = true;
	
	if(p.x == finder._pGoal.x && p.y == finder._pGoal.y && p.z == finder._pGoal.z)
	{
		console.debug("A* Search: Found goal");
		this.reconstructPath(p);
		return Pathfinding.FOUND;
	}
	
	/* Get neighbors for node */
	var neighbors = finder.neighbors(p, finder._graph);
	for(var i = 0; i < neighbors.length; ++i)
	{
		var n = neighbors[i];
		var graphPointType = finder._graph[n.x][n.y][n.z];
		if(this.closedset[n.x][n.y][n.z] == false)
		{
			var tentative_g_score = this.g_scores[p.x][p.y][p.z] + this.distance(p, n);
			
			var n_g_score = this.g_scores[n.x][n.y][n.z];
			if(n_g_score == null || tentative_g_score < n_g_score)
			{
				this.camefrom[n.x][n.y][n.z] = { x:p.x, y:p.y, z:p.z };
				if(n_g_score == null)
					this.openset.push({x:n.x, y:n.y, z:n.z});
				this.g_scores[n.x][n.y][n.z] = tentative_g_score;
				this.f_scores[n.x][n.y][n.z] = tentative_g_score + this.heuristic(n, finder._pGoal);
				
				if(graphPointType != Pathfinding.GOAL)
					finder._graph[n.x][n.y][n.z] = Pathfinding.CHECKED;
			}
		}
	}
	
	return Pathfinding.SEARCHING;
}

Pathfinding_Algorithm_A_Star.prototype.reconstructPath = function(p)
{
	console.debug("A* Search: Reconstructing Path");
	this.path = [];

	var step = p;	
	do
	{
		step = this.camefrom[step.x][step.y][step.z];
		if(step != null)
			this.path.unshift(step);
	}
	while(step != null);
}

Pathfinding.fnAddAlgorithm('a_star', new Pathfinding_Algorithm_A_Star());
