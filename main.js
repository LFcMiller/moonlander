

$(document).ready(initializeApp);
var game = null;

function initializeApp(){
	game = new MoonLanderGame();
	game.init();
}


function MoonLanderGame(){
	this.ship = new Lander(this);
	this.heartbeatTimer = null;
	this.heartBeatInterval = 10;
	this.gravity = 1.75; //10 pixels per second
	this.numberOfIntervals = 1000 / this.heartBeatInterval;
	this.gravityPerInterval = this.gravity / this.numberOfIntervals;
	this.init = function(){
		var shipElement = this.ship.create();
		$("body").append(shipElement);
		this.ship.init(this.gravityPerInterval);
		this.applyHandlers();
		this.startHeartbeat();
	}
	this.applyHandlers = function(){
		$('body').on('keydown',this.handleKeydown.bind(this));
		$('body').on('keyup',this.handleKeyup.bind(this));
	}
	this.handleKeydown = function(e){
		if(e.which === 32){
			this.ship.activateThrust();
		} else if(event.code==='ShiftRight'){
			this.ship.thrustRight();
		} else if(event.code==='ShiftLeft'){
			this.ship.thrustLeft();
		}

	}
	this.handleKeyup = function(e){
		if(e.which === 32){
			this.ship.deactivateThrust();
		} else if(event.code==='ShiftRight'){
			this.ship.thrustRight();
		} else if(event.code==='ShiftLeft'){
			this.ship.thrustLeft();
		}
	}
	this.startHeartbeat = function(){
		if(this.heartbeatTimer!==null){
			this.stopHeartbeat();
		}
		this.heartbeatTimer = setInterval(this.handleHeartbeat.bind(this), this.heartBeatInterval);
	}
	this.stopHeartbeat = function(){
		clearInterval(this.heartbeatTimer);
		this.heartbeatTimer = null;
	}
	this.handleHeartbeat = function(){
		this.ship.move();
		this.updateStats();
	}
	this.handleCollision = function(velocity){
		if(velocity > .5){
			alert('KABOOM!');
		}
		this.gameOver();
	}
	this.updateStats = function(){
		$("#velocity > span").text(this.ship.momentum.y.toFixed(2));
	}
	this.gameOver = function(){
		this.stopHeartbeat();
	}
	function Lander(parent){
		this.parent = parent;
		this.maxFuel = 1000;
		this.fuel = this.maxFuel;
		this.fuelPerSecond = 2000;
		this.fuelPerInterval = null;
		this.gravityPerInterval=null;
		this.domElement = null;
		this.thrustForcePerInterval = 0;
		this.defaultThrustForce = 2.3;
		this.defaultAttitudeThrust = .5;
		this.attitudeThrustPerIntervalValue=null;
		this.attitudeThrustPerInterval = {
			left: 0,
			right: 0
		}
		this.defaultThrustForcePerInterval = null;
		this.position = {
			left: null,
			top: null
		}
		this.momentum = {
			x: 0,
			y: 0
		}
		this.init = function(gravity){
			this.gravityPerInterval = gravity;
			this.position = this.domElement.position();
			this.defaultThrustForcePerInterval = this.defaultThrustForce / this.parent.numberOfIntervals;
			this.attitudeThrustPerIntervalValue = this.defaultAttitudeThrust / this.parent.numberOfIntervals;
			this.fuelPerInterval = this.fuelPerSecond / this.parent.numberOfIntervals;
		}
		this.thrustLeft = function(){
			this.attitudeThrustPerInterval.right = this.attitudeThrustPerInterval.right ? 0 : this.attitudeThrustPerIntervalValue;
			$("#lander > .leftThrust").toggleClass('active');
		}
		this.thrustRight = function(){
			this.attitudeThrustPerInterval.left = this.attitudeThrustPerInterval.left ? 0 : this.attitudeThrustPerIntervalValue;
			$("#lander > .rightThrust").toggleClass('active');
		}

		this.activateThrust = function(){
			this.thrustForcePerInterval = this.defaultThrustForcePerInterval;
			this.domElement.addClass('primaryThrust');
		}
		this.trackFuel = function(){
			$("#fuel > div").css('height',(100*(this.fuel / this.maxFuel)) + '%');
		}
		this.reduceFuel = function(){
			debugger;
			this.fuel -= this.fuelPerInterval * this.thrustForcePerInterval;
			if(this.fuel<=0){
				this.activateThrust = function(){};
				this.deactivateThrust();
			}
		}
		this.deactivateThrust = function(){
			this.thrustForcePerInterval = 0;
			this.domElement.removeClass('primaryThrust');
		}
		this.create = function(){
			this.domElement = $("<div>",{
				id: 'lander',
			});
			var leftAttitudeThruster = $("<div>",{
				class: 'leftThrust'
			});
			var rightAttitudeThruster = $("<div>",{
				class: 'rightThrust'
			});
			this.domElement.append(leftAttitudeThruster, rightAttitudeThruster);
			return this.domElement;
		}
		this.applyAttitudeThrust = function(){
			this.momentum.x += this.attitudeThrustPerInterval.right - this.attitudeThrustPerInterval.left;
		}
		this.applyGravity = function(){
			this.momentum.y += this.gravityPerInterval - this.thrustForcePerInterval;
		}
		this.detectCollision = function(){
			
			var landerTop = this.position.top;
			var landerBottom = landerTop + this.domElement.height();

			var groundElement = $("#ground");
			var groundPosition = groundElement.position();
			var groundTop = groundPosition.top;
			
			if(landerBottom >= groundTop){
				this.parent.handleCollision(this.momentum.y);
			}


		}

		this.move = function(){
			this.reduceFuel();
			this.trackFuel();
			this.applyGravity();
			this.applyAttitudeThrust();
			var top = this.position.top += this.momentum.y ;
			var left = this.position.left += this.momentum.x;
			this.domElement.css({
				left: left + 'px',
				top: top + 'px'
			});
			this.position = {
				top: top,
				left: left
			}
			this.detectCollision();
		}
	}
}






















