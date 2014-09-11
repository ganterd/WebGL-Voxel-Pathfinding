var Pathfinding = function()
{
	this._graph = [];
	this._pStart = {x:0, y:0, z:0};
	this._pGoal = {x:0, y:0, z:0};
	this._algorithms = [];
	this._currentAlgorithmFn = null;
};

Pathfinding.SPACE = 0;
Pathfinding.OBSTACLE = 1;
Pathfinding.START = 2;
Pathfinding.GOAL = 3;

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
Pathfinding.prototype.fnSetAlgorithmByName = function(name)
{
	if(this._algorithms == undefined)
	{
		console.error("Pathfinding: No alrogithms loaded");
		return;
	}
	
	if(this._algorithms[name] == undefined)
	{
		console.error("Parthfinding: No algorithm loaded with the name '" + name + "'");
		return;
	}
	
	this._currentAlgorithmFn = this._algorithms[name];
}