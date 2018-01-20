//CONST======================================================
const getX = 0;
const getY = 1;


const gravity = 0.5;

var zoom = 100;

Math.clamp = function (num, min, max) {
	return Math.max(min, Math.min(num, max));
}

function RendWidth() {
	return Math.max(window.innerWidth - 15, 100);
}

function RendHeight() {
	return Math.max(window.innerHeight - 15, 100);
}

//MOUSE========================================================

class cursor {
	constructor() {
		this.pos = [0, 0];
		this.dir = [0, 0];
		this.oldPos = [0, 0];

		this.clickPos = [0, 0];
		this.click = false;
	}

	SetCursorPos(x, y) {
		this.oldPos = [this.pos[getX], this.pos[getY]];

		this.pos[getX] = Math.clamp(x, 0, window.innerWidth - 8);
		this.pos[getY] = Math.clamp(y, 0, window.innerHeight - 8);

		this.dir = [this.pos[getX] - this.oldPos[getX], this.pos[getY] - this.oldPos[getY]];
	}

	Click(state) {
		this.click = state;

		if (this.click) {
			document.getElementById("can").style.cursor = "grabbing";
			this.clickPos = [this.pos[getX], this.pos[getY]];
		} else {
			document.getElementById("can").style.cursor = "grab";
		}
	}
}

var mouse = new cursor();

//GAMECONTROLL=================================================

class GameController {
	constructor() {

	}
}

class Renderer {
	constructor() {

		this.ref = document.getElementById("can");
		this.draw = this.ref.getContext("2d");

		this.scale;// = zoom / RendHeight();

		this.rendObject = [];

		this.Init();
	}

	Init() {
		this.Resize();
	}

	Resize() {
		document.getElementById("can").width = RendWidth();
		document.getElementById("can").height = RendHeight();

		//this.scale = RendHeight() / zoom;

		this.scale = 5;
	}

	Img(src = "", x, y, wdt, hgt) {
		this.draw.drawImage(document.getElementById(src), x * this.scale, y * this.scale, wdt * this.scale, hgt * this.scale);
	}

	Box(clr, x, y, wdt, hgt) {
		this.draw.fillStyle = clr;
		this.draw.fillRect(x, y, wdt * this.scale, hgt * this.scale);
	}

	RoundRect(clr, x, y, wdt, hgt) {
		this.Box(clr, (x + 15) * this.scale, y, (wdt - 30) * this.scale, (hgt) * this.scale);
		this.Box(clr, (x) * this.scale, (y + 15) * this.scale, (wdt) * this.scale, (hgt - 30) * this.scale);

		this.Circle(clr, x + 15, y + 15, 15);
		this.Circle(clr, (x + wdt) - 15, y + 15, 15);
		this.Circle(clr, x + 15, (y + hgt) - 15, 15);
		this.Circle(clr, (x + wdt) - 15, (y + hgt) - 15, 15);
	}

	Circle(clr, x, y, rad) {
		this.draw.beginPath();
		this.draw.arc(x * this.scale, y * this.scale, rad * this.scale, 0, 2 * Math.PI, false);
		this.draw.fillStyle = clr;
		this.draw.fill();
	}

	Text(text, clr, x, y, maxwdt) {
		this.draw.fillStyle = clr;
		this.draw.font = this.scale + "px Arial";
		this.draw.fillText(text, x * this.scale, y * this.scale, maxwdt * this.scale);
	}

	Clear() {
		this.draw.clearRect(0, 0, document.getElementById("can").width, document.getElementById("can").height);
	}

	BackGround(clr) {
		this.draw.fillStyle = clr;
		this.draw.fillRect(0, 0, RendWidth(), RendHeight());
	}

	addRendObj(obj) {
		this.rendObject.push(obj);
	}

	FUD() {
		renderer.Clear();
		renderer.BackGround("yellow");


		for (var i = 0; i < renderer.rendObject.length; i++) {
			renderer.rendObject[i].Rend();
		}

		//mouse.SetCursorPos(event.clientX - 8, event.clientY - 8);

		for (var i = 0; i < test.length; i++) {
			test[i].Physics();
		}

		requestAnimationFrame(renderer.FUD);

		Keyes();

	}
}

function Keyes(plrIndex = 0) {
	for (var i = 0; i < activeKeyes.length; i++) {
		if (activeKeyes[87] && test[plrIndex].isGrounded) {
			test[plrIndex].setForce(test[plrIndex].dir[getX], -10);
		}

		if (activeKeyes[68]) {
			test[plrIndex].setForce(10, test[plrIndex].dir[getY]);
		}

		if (activeKeyes[65]) {
			test[plrIndex].setForce(-10, test[plrIndex].dir[getY]);
		}

		if (activeKeyes[83]) {
			test[plrIndex].setForce(test[plrIndex].dir[getX], 10);
		}
	}
}

var renderer = new Renderer();

class RendObject {
	constructor(obj, x = obj.pos[getX], y = obj.pos[getY], width = obj.size[getX], height = obj.size[getY]) {

		this.obj = obj;

		this.pos = [x, y];
		this.size = [width, height];
		this.color = "gray";

		this.Init();
	}

	Init() {
		renderer.addRendObj(this);
	}

	Rend() {
		renderer.Box(this.color, this.obj.pos[getX], this.obj.pos[getY], this.obj.size[getX], this.obj.size[getY]);
	}
}

//GAMEOBJECT======================================================

class GameObject {
	constructor(x, y, sx, sy) {
		this.pos = [x, y];
		this.size = [sx, sy];

		this.oldPos = [x, y];

		this.dir = [0, 0];
		this.gravityAcceleration = 0;

		this.friction = 0.75;
		this.bounce = 0.2;

		this.clickOnPos = [0, 0];

		this.isGrounded = false;

		this.rendObject = new RendObject(this, this.pos[getX], this.pos[getY], this.size[getX], this.size[getY]);

		this.Init();
	}

	Init() {

	}

	Physics(custom = false) {
		if (custom || this.OnMouseClick() || this.OnCollide() || this.pos[getY] >= RendHeight() - this.size[getY] * renderer.scale) {
			this.isGrounded = true;
			this.dir = [this.dir[getX] * this.friction, this.dir[getY] -(this.gravityAcceleration * this.bounce)];
			this.gravityAcceleration = 0;
		} else {
			this.isGrounded = false;
			this.gravityAcceleration += gravity;
			this.dir[getY] += gravity;
		}

		this.Move(this.dir[getX], this.dir[getY]);
	}

	OnMouseClick() {
		if (   mouse.pos[getX] >= this.pos[getX] 
			&& mouse.pos[getX] <= this.pos[getX] + this.size[getX] * renderer.scale
			&& mouse.pos[getY] >= this.pos[getY]
			&& mouse.pos[getY] <= this.pos[getY] + this.size[getY] * renderer.scale
			&& mouse.click
			//&& mouse.clickPos[getX] >= this.pos[getX]
			//&& mouse.clickPos[getX] <= this.pos[getX] + this.size[getX] * renderer.scale
			//&& mouse.clickPos[getY] >= this.pos[getY]
			//&& mouse.clickPos[getY] <= this.pos[getY] + this.size[getX] * renderer.scale
		) {
			this.SetPos(mouse.pos[getX] - (mouse.clickPos[getX] - this.clickOnPos[getX]), mouse.pos[getY] - (mouse.clickPos[getY] - this.clickOnPos[getY]));
			this.dir = [mouse.dir[getX] * 5, mouse.dir[getY] * 5];
			return true;
		} else {
			this.clickOnPos = [this.pos[getX], this.pos[getY]];
			return false;
		}
	}

	OnCollide(collider = test) {
		//console.log(collider.length);
		for (var i = 0; i < collider.length; i++) {
			if (collider[i] != this) {
				if (this.pos[getX] <= collider[i].pos[getX] + collider[i].size[getX] * renderer.scale
					&& this.pos[getX] + this.size[getX] * renderer.scale >= collider[i].pos[getX]
					&& this.pos[getY] <= collider[i].pos[getY] + collider[i].size[getY] * renderer.scale
					&& this.pos[getY] + this.size[getY] * renderer.scale >= collider[i].pos[getY]
				) {
					if (this.oldPos[getX] >= collider[i].pos[getX] + collider[i].size[getX] * renderer.scale) {
						this.pos[getX] = Math.max(this.pos[getX], collider[i].pos[getX] + collider[i].size[getX] * renderer.scale + 0.01);
						this.dir[getX] = 0;
					}

					if (this.oldPos[getX] + this.size[getX] * renderer.scale <= collider[i].pos[getX]) {
						this.pos[getX] = Math.min(this.pos[getX] + this.size[getX] * renderer.scale, collider[i].pos[getX] - this.size[getX] * renderer.scale - 0.01);
						this.dir[getX] = 0;
					}

					if (this.oldPos[getY] + this.size[getY] * renderer.scale <= collider[i].pos[getY]) {
						this.pos[getY] = Math.min(this.pos[getY] + this.size[getY] * renderer.scale, collider[i].pos[getY] - this.size[getY] * renderer.scale);
						this.dir[getY] = 0;
					}

					/*if (this.pos[getY] + this.size[getY] * renderer.scale >= (collider[i].pos[getY] +200) && !this.isGrounded) {
						this.pos[getY] = collider[i].pos[getY] - this.size[getY] * renderer.scale;
						this.dir[getY] = 0;
					}/**/

					return true;
				} 
			}
		}
		return false;
	}

	addForce(x, y) {
		this.dir[getX] += x;
		this.dir[getY] += y;
	}

	setForce(x, y) {
		this.dir[getX] = x;
		this.dir[getY] = y;
	}

	Move(x, y) {
		this.oldPos = [this.pos[getX], this.pos[getY]];

		this.pos[getX] = Math.clamp(this.pos[getX] + x, 0, RendWidth() - this.size[getX] * renderer.scale);
		this.pos[getY] = Math.min(RendHeight() - this.size[getY] * renderer.scale, (this.pos[getY] + y));
	}

	SetPos(x, y) {
		this.oldPos = [this.pos[getX], this.pos[getY]];
		this.pos[getX] = Math.clamp(x, 0, RendWidth() - this.size[getX] * renderer.scale);
		this.pos[getY] = Math.min(y, RendHeight() - this.size[getY] * renderer.scale);
	}
}

var test = [new GameObject(0, 0, 10, 20), new GameObject(500, 70, 20, 50), new GameObject(300, 10, 20, 20), new GameObject(170, 100, 15, 10)];
test[1].rendObject.color = "red";
test[2].rendObject.color = "green";
test[3].rendObject.color = "blue";

//EVENT===========================================================

window.onload = function () {
	renderer.FUD();
}


window.onresize = function () {
	renderer.Resize();
}

var activeKeyes = [];

window.addEventListener("keydown", (event) => {
	console.log(event.keyCode);

	activeKeyes[event.keyCode] = true;

});

window.addEventListener("keyup", (event) => {
	activeKeyes[event.keyCode] = false;
	for (var i = 0; i < activeKeyes.length; i++) {

	}
});

window.addEventListener("mousemove", (event) => {
	mouse.SetCursorPos(event.clientX - 8, event.clientY - 8);
});

window.addEventListener("mousedown", (event) => {
	mouse.Click(true);

});

window.addEventListener("mouseup", (event) => {
	mouse.Click(false);
});