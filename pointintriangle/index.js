const DOT_SIZE = 10

let triangle = []
let dots = []

class Point {
  constructor(_x, _y, _col = 'black') {
    this.x = _x
    this.y = _y
    this.col = _col
  }

  draw(_d) {
    _d.stroke(this.col)
    _d.fill(this.col)
    _d.strokeWeight(1)
    _d.ellipse(this.x, this.y, DOT_SIZE)
  }
}


let setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  d.c.addEventListener('click', mouseclickHandler, false)  
  windowResize()

  regenTriangle()
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.setCanvasSize(rect.width, rect.height)
}

let draw = () => {
  d.ctx.clearRect(0, 0, d.c.width, d.c.height)

  let txtSize = 80
  d.textSize(txtSize)
  d.fill('#00000088')
  let txt = "Click to place dots"

  while (d.ctx.measureText(txt).width > d.c.width)
  {
    txtSize *= 2/3
    d.textSize(txtSize)
  }

  d.text(txt, (d.c.width - d.ctx.measureText(txt).width) / 2, d.c.height / 3)
  
  triangle.forEach(p => p.draw(d))
  dots.forEach(p => p.draw(d))

  d.stroke('black')
  for (let i = 0; i < 3; i++) {
    let p1 = triangle[i]
    let p2 = triangle[(i + 1) % 3]
    d.line(p1.x, p1.y, p2.x, p2.y)
  }
}

window.onresize = function(event) {
  windowResize()
  draw()
}

let tick = () => {
  draw()
}

let mouseclickHandler = (e) => {
  let p = new Point(e.clientX, e.clientY, 'red')
  if (pInTri(p, triangle)) p.col = 'green'
  dots.push(p)
}

let pInTri = (_p, _tri) => {
  let s = _tri[0].y * _tri[2].x - _tri[0].x * _tri[2].y + (_tri[2].y - _tri[0].y) * _p.x + (_tri[0].x - _tri[2].x) * _p.y;
  let t = _tri[0].x * _tri[1].y - _tri[0].y * _tri[1].x + (_tri[0].y - _tri[1].y) * _p.x + (_tri[1].x - _tri[0].x) * _p.y;

  if ((s < 0) != (t < 0)) return false;

  let A = -_tri[1].y * _tri[2].x + _tri[0].y * (_tri[2].x - _tri[1].x) + _tri[0].x * (_tri[1].y - _tri[2].y) + _tri[1].x * _tri[2].y;

  return (A < 0) ? (s <= 0 && (s + t) >= A) : (s >= 0 && (s + t) <= A);
}

let regenTriangle = () => {
  triangle = []
  dots = []
  for (let i = 0; i < 3; i++) {
    triangle.push(new Point(Math.random() * d.width, Math.random() * d.height))
  }
}

setup()
setInterval(tick, 1000 / 60);
