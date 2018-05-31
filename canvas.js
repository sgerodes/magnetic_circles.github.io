let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext('2d');

let mouse = {
    x : undefined,
    y : undefined
};

window.addEventListener('mousemove',function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('click',function (event) {
    mouse.x = undefined;
    mouse.y = undefined;
});
window.addEventListener("keyup", function dealWithKeyboard(e) {
    if (e.keyCode === 32){
        color_palette_nr = (color_palette_nr + 1) % color_palette.length;
        init();
    }
});

let circleArray = [];
let circleAmount = 1000;
let maxRadius = 30;
let maxInitialRadius = 10;
let minRadius = 2;
let maxVelocity = 1;
let minVelocity = 0.5;
let mouseReactionDistance = 200;
let magnetStrength = 0.3;
let CenterX = canvas.width / 2;
let CenterY = canvas.height / 2;
let color_palette_nr = 2;
let color_palette = [
    [
    "#2E0927",
    "#D90000",
    "#FF2D00",
    "#FF8C00",
    "#04756F"
    ],
    [
    "#0A1C28",
    "#41848F",
    "#72A7A3",
    "#97C0B7",
    "#EEE9D1"
    ],
    [
    "#E6F5F7",
    "#9FE3DD",
    "#51BFB5",
    "#11625B",
    "#004843"
    ]
];

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.initial_radius = radius;
    this.radius = radius;
    this.color=color_palette[color_palette_nr][Math.floor(Math.random()*color_palette.length)];

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    };

    this.update = function () {
        if (this.x + maxRadius> canvas.width || this.x - maxRadius < 0)
        {
            this.dx *= -1;
        }
        if (this.y + maxRadius> canvas.height || this.y - maxRadius < 0)
        {
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;

        if (Math.sqrt(Math.pow(mouse.x - this.x,2) + Math.pow(mouse.y - this.y,2)) < mouseReactionDistance){
            this.makeCirclesSizeReturnToInitialSize();
            this.cursorMagnet(true);
        } else {
            this.makeCirclesBigger();
            this.slowDownVelocity();
        }
        this.draw();
    };

    this.makeCirclesBigger = function () {
        if (this.radius < maxRadius){
            this.radius += 1;
        }
    };
    this.makeCirclesSizeReturnToInitialSize = function () {
        if (this.radius > this.initial_radius){
            this.radius -= 1;
        }
    };
    this.cursorMagnet = function (antiMagnet = false) {
        let xDistance = mouse.x-this.x;
        let yDistance = mouse.y-this.y;
        let direction = antiMagnet ? -1 : 1;
        let accVelocity=Math.sqrt(Math.pow(this.dx,2) + Math.pow(this.dy,2));
        if (accVelocity < maxVelocity){
            this.dx = (this.dx + direction * magnetStrength / xDistance) % maxVelocity;
            this.dy = (this.dy + direction * magnetStrength / yDistance) % maxVelocity;
            //this.x -= direction * magnetStrength / xDistance/10;
            //this.y -= direction * magnetStrength / yDistance/10;
        } else {
            this.dx *= 0.9;
            this.dy *= 0.9;
        }
    };

    this.slowDownVelocity = function () {
        if (Math.abs(this.dx) > maxVelocity || Math.abs(this.dy) > maxVelocity) {
            this.dx = 0.7 * this.dx;
            this.dy = 0.7 * this.dy;
        }
    };
}
function init(){
    circleArray = [];
    for (let i = 0; i < circleAmount; ++i) {
        let radius = minRadius + (Math.random() * (maxInitialRadius - minRadius));
        let x=maxRadius+Math.random()*(canvas.width- 2 * maxRadius);
        let y=maxRadius+Math.random()*(canvas.height- 2 * maxRadius);
        let dx = (Math.random() - 0.5) * (maxVelocity+minVelocity);
        let dy = (Math.random() - 0.5) * (maxVelocity+minVelocity);
        circleArray.push(new Circle(x, y, dx, dy, radius))
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    /*
    let fontSize = 60;
    c.font = fontSize + "px Arial";
    c.fillText("Happy Birthday",CenterX-0.3 *canvas.width,CenterY);
    c.fillText("Дедушка",CenterX-0.1 *canvas.width,CenterY+fontSize);
    */
    for (let i = 0; i < circleArray.length; ++i) {
        circleArray[i].update();
    }
}

init();
animate();
