window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();


var canvas = document.getElementById("game"),
	ctx    = canvas.getContext("2d"),
	width  = canvas.width,
	height = canvas.height,
	points = 0, // total number of points scored to increase speed
	flag   = 0; // flag to determine which player won
	newgame = 0; 
	

	
// object of key codes used for game functionality
var KEY_CODES = {38:'up', 40:'down', 32:'space' , 87:'wUp', 83:'sDown'};
keys = {};
	
function startgame() {
	setupInput(); // setup player input keys
	drawTitleScreen();
};

function drawTitleScreen() {
	drawCanvas();
	// start animation frame to hear player input
	start = requestAnimFrame(drawTitleScreen);
	ctx.fillStyle = '#00ff00';
	ctx.textAlign = "center";
	ctx.font = "bold 60px bangers";
	ctx.textBaseline = "middle";
	ctx.fillText("Pong", width/2, height/2 - 30);
	ctx.font = "25px bangers";
	var startMsg = "Press the Space Bar to Play";
	ctx.fillText(startMsg, width/2, height/2 + 20 );
	if (keys['space']) {
	cancelRequestAnimFrame(start);
	initialize();
	}
};

// reset canvas during every iteration of loop	
function drawCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
};

 // function to determine if keys have been pressed and prevents window
 // from using those keys codes for other window functionality
  function setupInput() {
    window.addEventListener('keydown',function(e) {
      if(KEY_CODES[e.keyCode]) {
       keys[KEY_CODES[e.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[e.keyCode]) {
       keys[KEY_CODES[e.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  };

var Ball = {
	color: '#00ff00',
	radius: 7,
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	
	// function to draw ball on canvas
	draw: function(){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	},
	
	// function to update position of ball on canvas
	update: function(){
		this.x += this.vx;
		this.y += this.vy;
	},
	
	// function to reset ball during initialization and after a point is scored
	reset: function(){
		this.x = width/2;
		this.y = height/2;
		
		// increase speed of ball off serve by an increment of .5 every 4 points
		// scored and randomly dictate the direction the ball travels off the serve 
		if(points < 5){
		this.vx = (!!Math.round(Math.random() * 1) ? 5 : -5);
		this.vy = (!!Math.round(Math.random() * 1) ? 5 : -5);
		}
		if(points >= 5) {
		this.vx = (!!Math.round(Math.random() * 1) ? 5.5 : -5.5);
		this.vy = (!!Math.round(Math.random() * 1) ? 5.5 : -5.5);
		}
		if(points >= 9) {
		this.vx = (!!Math.round(Math.random() * 1) ? 6 : -6);
		this.vy = (!!Math.round(Math.random() * 1) ? 6 : -6);
		}
		if(points >= 13) {
		this.vx = (!!Math.round(Math.random() * 1) ? 6.5 : -6.5);
		this.vy = (!!Math.round(Math.random() * 1) ? 6.5 : -6.5);
		}
		if(points >= 17) {
		this.vx = (!!Math.round(Math.random() * 1) ? 7 : -7);
		this.vy = (!!Math.round(Math.random() * 1) ? 7 : -7);
		}
	}
};

var Player1 = {
	color: '#00ff00',
	width: 8,
	height:100,
	x:2,
	y:0,
	score:0,
	
	// function to draw player1 paddle and display the which player1 logo
	// and score on the left portion of the canvas
	draw: function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.textAlign = "left";
		ctx.font = "bold 20px Arial, sans-serif";
		ctx.fillText("Player 1", 20, 20);
		ctx.textAlign = "left";
		ctx.font = "bold 30px Arial, sans-serif";
		ctx.fillText(Player1.score, width/2 - 30, 30);
	},
	
	// function to update the position of the player1 paddle by either 8 or
	// -8 depending on the key pressed
	update: function(){
		if (keys['wUp']) this.y -= 8;
		if (keys['sDown']) this.y += 8;
		
	// keep the player1 paddle within the canvas height
		this.y = Math.max(Math.min(this.y, height - this.height), 0);
	},
	
	// function to determine if the ball's position has collided with the position of the
	// player1 paddle
	collide: function () {
		if (Ball.x - Ball.radius > this.width + this.x || this.x > Ball.radius + Ball.x) 
			return false;
		if (Ball.y - Ball.radius > this.height + this.y || this.y > Ball.radius + Ball.y) 
			return false;
	  // else return true if ball collides with player1's paddle
	  return true;
	},
};

var Player2 = {
	color: '#00ff00',
	width: 8,
	height:100,
	x:0,
	y:0,
	score:0,
	
	// function to draw player1 paddle and display the which player2 logo
	// and score on the right portion of the canvas
	draw: function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.textAlign = "right";
		ctx.font = "bold 20px Arial, sans-serif";
		ctx.fillText("Player 2", width - 20, 20);
		ctx.textAlign = "right";
		ctx.font = "bold 30px Arial, sans-serif";
		ctx.fillText(Player2.score, width/2 + 30, 30);
	},
	
	// function to update the position of the player2 paddle by either 8 or
	// -8 depending on the key pressed
	update: function(){
		if (keys['up']) this.y -= 8;
		if (keys['down']) this.y += 8;
		this.y = Math.max(Math.min(this.y, height - this.height), 0);
	}, 
	
	// function to determine if the ball's position has collided with the position of the
	// player2 paddle
	collide: function () {
		if (Ball.x - Ball.radius > this.width + this.x || this.x > Ball.radius + Ball.x) 
			return false;
		if (Ball.y - Ball.radius > this.height + this.y || this.y > Ball.radius + Ball.y) 
			return false;
	// else return true if ball collides with player2's paddle
	  return true;
	},
	
};

// function to initialize objects and variable to create new game
function initialize() {
	flag = 0;
	Player1.score = 0;
	Player2.score = 0;
	
	// initialize paddles positions on canvas
	Player1.y = (height - Player1.height)/2;
	Player2.x = width - Player2.width - 2;
	Player2.y = (height - Player2.height)/2;
	// serve ball
	Ball.reset();
	// call game loop function
	loop();
};

function restart() {
	flag = 0;
	newgame = 0; // set newgame flag back to default
	Player1.score = 0;
	Player2.score = 0;
	
	// initialize paddles positions on canvas
	Player1.y = (height - Player1.height)/2;
	Player2.x = width - Player2.width - 2;
	Player2.y = (height - Player2.height)/2;
	// set up player input keys
	setupInput();
	// serve ball
	Ball.reset();
	// call game loop function
	loop();
};

// function to call all objects draw methods and draw net on canvas
function draw() {
	drawCanvas();
		Ball.draw();
		Player1.draw();
		Player2.draw();

	// draws net down the center of the canvas
	var w = 4;
	var x = (width - w)/2;
	var y = 0;
	var h = height;
		ctx.fillRect(x, y, w, h);
};


// function to update the positions of all objects on the canvas
function update() {
Player1.update();
Player2.update();
Ball.update();
};


function loop(){
init = requestAnimFrame(loop);
draw();
update()

// if a player's paddle collide with invert the direction of ball and increase speed
if(Player1.collide() || Player2.collide()){
		Ball.vx = Ball.vx * -1;
		Ball.vx += (Ball.vx > 0 ? 0.5 : -0.5 );
		if(Math.abs(Ball.vx) > Ball.radius * 1.5)
			Ball.vx = (Ball.vx > 0 ? Ball.radius * 1.5 : Ball.radius * -1.5);
	}
// if ball hits top or bottom wall invert the y velocity
if(Ball.y - Ball.radius < 0 || Ball.y + Ball.radius > height)
		Ball.vy = Ball.vy * -1;
	
	// if ball hits the right wall increment player2 score and total points scored
	// and reset the position of the ball
	if(Ball.x - Ball.radius <= 0){
		Player2.score++;
		points++;
		Ball.reset();
		}
	// if ball hits the left wall increment player1 score and total points scored
	// and reset the position of the ball
	else if(Ball.x + Ball.radius > width){
		Player1.score++;
		points++;
		Ball.reset();
	}
	
    if(Player1.score == 10){
		flag = 1;
		win();
		}
	if(Player2.score == 10){
		flag = -1;
		win();
		}
	
};

function win() {
	drawCanvas();
	cancelRequestAnimFrame(init); // end game animation frame loop
	restartGame = requestAnimFrame(win); // new animation frame to listen for player input
	
	ctx.fillStyle = '#00ff00';
	ctx.font = "35px bangers";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	// Player1 win
	if(flag == 1){
	ctx.fillText("Congratulations Player 1: You Win!", width/2, height/2 - 35);
	ctx.font = "25px bangers";
	ctx.fillText("Press the space bar to play again",  width/2, height/2);
	if (keys['space']) {
	newgame = 1;
	}
	}
	// Player2 win
	else{
	ctx.fillText("Congratulations Player 2: You Win!", width/2, height/2 - 35);
	ctx.font = "25px bangers";
	ctx.fillText("Press the Space Bar to Play Again",  width/2, height/2);
	if (keys['space']) {
	newgame = 1;
	}
	}
	if (newgame == 1){
	cancelRequestAnimFrame(restartGame);
	restart();
	}
	
};

startgame();


