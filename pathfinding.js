var Pathfinding = function()
{
	this._graph = [];
	this._pStart = null;
	this._pCurrent = null;
	this._pGoal = null;
	this._currentAlgorithmFn = null;
	this._status = Pathfinding.NOT_RUNNING;
};

Pathfinding.SPACE = 0;
Pathfinding.OBSTACLE = 1;
Pathfinding.START = 2;
Pathfinding.GOAL = 3;
Pathfinding.CHECKED = 4;

Pathfinding.NOT_RUNNING = 0;
Pathfinding.SEARCHING = 1;
Pathfinding.NOT_FOUND = 2;
Pathfinding.FOUND = 3;

Pathfinding._algorithms = [];

/* Function for API users to set the graph */
Pathfinding.prototype.fnSetGraph = function(g, startPos, goalPos)
{
	this._graph = g;
}

/* Sets the start position in the path finding graph */
Pathfinding.prototype.fnSetStartPosition = function(p)
{
	if(this._graph == undefined || this._graph.length == 0)
	{
		console.error("Pathfinding: Graph needs to be set before assigning start position.");
		return;
	}
	
	this._pStart = p;
	this._pCurrent = p;
	this._graph[p.x][p.y][p.z] = Pathfinding.START;
}

/* Sets the goal position in the path finding graph */
Pathfinding.prototype.fnSetGoalPosition = function(p)
{
	if(this._graph == undefined || this._graph.length == 0)
	{
		console.error("Pathfinding: Graph needs to be set before assigning goal position.");
		return;
	}
	
	this._pGoal = p;
	this._graph[p.x][p.y][p.z] = Pathfinding.GOAL;
}

/* Sets the path finding algorithm to the algorithm with the name 'name' */
Pathfinding.prototype.fnLoadAlgorithm = function(name)
{	
	if(Pathfinding._algorithms[name] == undefined)
	{
		console.error("Parthfinding: No algorithm loaded with the name '" + name + "'");
		return;
	}
	
	this._currentAlgorithmFn = Pathfinding._algorithms[name];
	console.debug("Pathfinding: Algorithm '" + name + "' is now loaded");
}

Pathfinding.prototype.fnInitSearch = function()
{
	this._status = Pathfinding.NOT_RUNNING;
	
	if(this._currentAlgorithmFn == null)
		console.warn("Pathfinding: Search wasn't started because no algorithm is loaded");
	else if(this._graph == null)
		console.warn("Pathfinding: Search wasn't started because no graph was loaded");
	else if(this._pStart == null)
		console.warn("Pathfinding: Search wasn't started because start point wasn't defined");
	else if(this._pGoal == null)
		console.warn("Pathfinding: Search wasn't started because goal point wasn't definted");
	else
	{
		this._currentAlgorithmFn.init(this);
		this._status = Pathfinding.SEARCHING;
	}
}

Pathfinding.prototype.fnTick = function()
{
	if(this._currentAlgorithmFn && this._status == Pathfinding.SEARCHING)
	{
		this._status = this._currentAlgorithmFn.tick(this);
		if(this._status == Pathfinding.FOUND)
		{
			var path = this._currentAlgorithmFn.path;
			return { status:this._status, path:path };
		}
		return { status:this._status };
	}
	
	this._status = Pathfinding.NOT_RUNNING;
	return { status:this._status };
}

Pathfinding.prototype.neighbors = function(p, graph)
{
	var n = [];
	
	var nSearches = [
		{x:-1, y:0, z:0},
		{x:1, y:0, z:0},
		
		{x:0, y:-1, z:0},
		{x:0, y:1, z:0},
		
		{x:0, y:0, z:-1},
		{x:0, y:0, z:1}
	];
	
	for(var i = 0; i < nSearches.length; ++i)
	{
		var x = nSearches[i].x + p.x;
		var y = nSearches[i].y + p.y;
		var z = nSearches[i].z + p.z;
		
		if(x < 0 || x >= graph.length)
			continue;
		else if (y < 0 || y >= graph[x].length)
			continue;
		else if (z < 0 || z >= graph[x][y].length)
			continue;
		else if(graph[x][y][z] != Pathfinding.OBSTACLE && !(x == p.x && y == p.y && z == p.z))
			n.push({x:x, y:y, z:z});
	}
	
	return n;
}

/* Adds the algorithm with name 'name' and function 'fn' to the loaded algorithms */
Pathfinding.fnAddAlgorithm = function(name, fn)
{
	if(Pathfinding._algorithms[name])
	{
		console.warn("Pathfinding: Overwriting algorithm '" + name + "'");
	}
	
	Pathfinding._algorithms[name] = fn;
	console.debug("Pathfinding: Algorithm '" + name + "' is now available");
}
