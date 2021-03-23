const DOT_SIZE = 10
let N_SIDES = 6

let poly = []
let dots = []
let polyCom = null

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

  document.getElementById('sides-input').value = N_SIDES

  regenPoly()
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
  
  poly.forEach(p => p.draw(d))
  dots.forEach(p => p.draw(d))
  polyCom.draw(d)

  d.stroke('black')
  for (let i = 0; i < poly.length; i++) {
    let p1 = poly[i]
    let p2 = poly[(i + 1) % poly.length]
    d.line(p1.x, p1.y, p2.x, p2.y)
  }

  d.stroke('gray')
  for (let i = 0; i < poly.length; i++) {
    let p1 = poly[i]
    let p2 = polyCom
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
  if (pInPoly(p, poly)) p.col = 'green'
  dots.push(p)
}

let pInTri = (_p, _tri) => {
  let s = _tri[0].y * _tri[2].x - _tri[0].x * _tri[2].y + (_tri[2].y - _tri[0].y) * _p.x + (_tri[0].x - _tri[2].x) * _p.y;
  let t = _tri[0].x * _tri[1].y - _tri[0].y * _tri[1].x + (_tri[0].y - _tri[1].y) * _p.x + (_tri[1].x - _tri[0].x) * _p.y;

  if ((s < 0) != (t < 0)) return false;

  let A = -_tri[1].y * _tri[2].x + _tri[0].y * (_tri[2].x - _tri[1].x) + _tri[0].x * (_tri[1].y - _tri[2].y) + _tri[1].x * _tri[2].y;

  return (A < 0) ? (s <= 0 && (s + t) >= A) : (s >= 0 && (s + t) <= A);
}

let pInPoly = (_p, _poly) => {
  for (let i = 0; i < _poly.length; i++) {
    let p1 = _poly[i]
    let p2 = _poly[(i + 1) % _poly.length]

    if (pInTri(_p, [p1, p2, polyCom])) return true
  }

  return false
}

let regenPoly = () => {
  N_SIDES = document.getElementById('sides-input').value
  if (N_SIDES < 3) N_SIDES = 3

  poly = []
  dots = []
  for (let i = 0; i < N_SIDES; i++) {
    poly.push(new Point(Math.random() * d.width, Math.random() * d.height))
  }

  sortPolyPoints(poly)
  polyCom = getPolyCOM(poly)
}

let getPolyCOM = points => {
  let com = new Point(0, 0, 'gray')

  points.forEach(p=>{
    com.x+=p.x
    com.y+=p.y
  })

  com.x/=points.length
  com.y/=points.length

  return com
}

// order by polar angle to centre
let sortPolyPoints = points => {
  let com = getPolyCOM(points)
  
  points.sort((a, b) => {
    let a1 = Math.atan2(com.y-a.y, com.x-a.x)
    let a2 = Math.atan2(com.y-b.y, com.x-b.x)

    return a1 - a2
  })
}

setup()
setInterval(tick, 1000 / 60);
