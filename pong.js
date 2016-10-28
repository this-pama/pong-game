var name= prompt('What is your name please?').toUpperCase();
var canvas;
var canvasContext;
var xCordinateOfBAll = 30;
var yCordinateOfBall = 30;
var ballSpeedOnXAxis = 5;
var ballSpeedOnYAxis = 1;
var player1Score = 0;
var player2Score = 0;
const winningScore = 11;
var resultOutput = false;
var yCordinateOfPaddle1 = 250;
var yCordinateOfPaddle2 = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
var collisionMusic = null;
var winningMusic = null;
//starts game only after all other assests have been loaded
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	collisionMusic = document.getElementById("collide");
	winningMusic = document.getElementById("finish");
	var framesPerSecond = 150;
  	setInterval(function() {
			moveBallAndPaddle();
			drawBallAndPaddle();	
		}, 1000/framesPerSecond);
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mousemove',
		function(mouseClick) {
			var mousePosition = calculateMousePosition(mouseClick);
			yCordinateOfPaddle1 = mousePosition.y - (PADDLE_HEIGHT/2);
		});
}
//calculates mouse position
function calculateMousePosition(mouseClick) {
	var rectangle = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var xAxisOfMouse = mouseClick.clientX - rectangle.left - root.scrollLeft;
	var yAxisOfMouse = mouseClick.clientY - rectangle.top - root.scrollTop;
	return {
		x:xAxisOfMouse,
		y:yAxisOfMouse
	};
}
function handleMouseClick(mouseClick) {
	if(resultOutput) {
		player1Score = 0;
		player2Score = 0;
		resultOutput = false;
	}
}
//resets the ball to the center
function resetBall() {
	if(player1Score >= winningScore ||
		player2Score >= winningScore) {
		winningMusic.play();
		resultOutput = true;
	}
	ballSpeedOnXAxis = -ballSpeedOnXAxis;
	xCordinateOfBAll = canvas.width/2;
	yCordinateOfBall = canvas.height/2;
}
//create computer paddle's motion
function paddle2Movement() {
	var paddle2YCenter = yCordinateOfPaddle2 + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < yCordinateOfBall - 30) {
		yCordinateOfPaddle2 = yCordinateOfPaddle2 + 2;
	} else if(paddle2YCenter > yCordinateOfBall + 30) {
		yCordinateOfPaddle2 = yCordinateOfPaddle2 - 2;
	}
}
//move the ball and paddles
function moveBallAndPaddle() {
	if(resultOutput) {
		return;
	}
	paddle2Movement();
	xCordinateOfBAll = xCordinateOfBAll + ballSpeedOnXAxis;
	yCordinateOfBall = yCordinateOfBall + ballSpeedOnYAxis;
	if(xCordinateOfBAll < 15) {
		if(yCordinateOfBall > yCordinateOfPaddle1 && yCordinateOfBall < yCordinateOfPaddle1+PADDLE_HEIGHT) {
			ballSpeedOnXAxis = -ballSpeedOnXAxis;
			collisionMusic.play();
			var deltaY = yCordinateOfBall-(yCordinateOfPaddle1+PADDLE_HEIGHT/2);
			ballSpeedOnYAxis = deltaY * 0.08;

		} else {
			player2Score++; 
			resetBall();
		}
	}
	if(xCordinateOfBAll > (canvas.width - 15) ) {
		if(yCordinateOfBall > yCordinateOfPaddle2 && yCordinateOfBall < yCordinateOfPaddle2+PADDLE_HEIGHT) {
			ballSpeedOnXAxis = -ballSpeedOnXAxis;
			collisionMusic.play();
			var deltaY = yCordinateOfBall-(yCordinateOfPaddle2+PADDLE_HEIGHT/2);
			ballSpeedOnYAxis = deltaY * 0.08;
		} else {
			player1Score++; 
			resetBall();	
		}
	}
	if(yCordinateOfBall < 0 || yCordinateOfBall > canvas.height) {
		ballSpeedOnYAxis = -ballSpeedOnYAxis;
	}
}
//draws the net 
function drawCenterLine() {
	for(var i=0;i<canvas.height;i+=40) {
		rectangleColor(canvas.width/2-1,i,2,20,'white');
	}
}
//draws a rectangle
function rectangleColor(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}
//draws the ball and paddles
function drawBallAndPaddle() {
	// next line blanks out the screen with black
	rectangleColor(0,0,canvas.width,canvas.height, "#0a181c");
	if(resultOutput) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= winningScore) {
			canvasContext.font = "50px serif"
			canvasContext.fillText(name + " " +" won!", 500, 200);
		} else if(player2Score >= winningScore) {
			canvasContext.font = "50px serif"
			canvasContext.fillText("Computer won!", 450, 200);
		}
		canvasContext.font = "25px serif"
		canvasContext.fillText("Click anywhere to restart", 500, 500);
		return;
	}
  //ensures net is drawn before  paddles and ball
	drawCenterLine();
	// this is left player paddle
	rectangleColor(0,yCordinateOfPaddle1,PADDLE_THICKNESS,PADDLE_HEIGHT,'brown');
	// this is right computer paddle
	rectangleColor(canvas.width-PADDLE_THICKNESS,yCordinateOfPaddle2,PADDLE_THICKNESS,PADDLE_HEIGHT,'brown');
	// next line draws the ball
	ballColor(xCordinateOfBAll, yCordinateOfBall, 10, 'white');
	canvasContext.font = "35px serif"
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}
//draws a circle
function ballColor(centerX, centerY, radius, drawColor, fontType) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}
