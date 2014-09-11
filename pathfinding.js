var Pathfinding = function()
{
	this._graph = [];
	this._pStart = {x:0, y:0, z:0};
	this._pCurrent = {x:0, y:0, z:0};
	this._pGoal = {x:0, y:0, z:0};
	this._currentAlgorithmFn = null;
};

Pathfinding.SPACE = 0;
Pathfinding.OBSTACLE = 1;
Pathfinding.START = 2;
Pathfinding.GOAL = 3;
Pathfinding.CHECKED = 4;

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

Pathfinding.prototype.fnTick = function()
{
	if(this._currentAlgorithmFn)
	{
		this._currentAlgorithmFn.tick(this);
	}
}

Pathfinding.prototype.neighbors = function(p, graph)
{
	var n = [];
	for(var x = p.x - 1 >= 0 ? p.x - 1 : 0; x <= p.x + 1 && x < graph.length; ++x)
	{
		for(var y = p.y - 1 >= 0 ? p.y - 1 : 0; y <= p.y + 1 && y < graph[x].length; ++y)
		{
			for(var z = p.z - 1 >= 0 ? p.z - 1 : 0; z <= p.z + 1 && z < graph[x][y].length; ++z)
			{
				if(graph[x][y][z] != Pathfinding.OBSTACLE && x != p.x && y != p.y && z != p.z)
				{
					n.push({x:x, y:y, z:z});
				}
			}
		}
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