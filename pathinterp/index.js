const DOT_SIZE = 10

class Point {
  constructor(_x, _y) {
    this.x = _x
    this.y = _y
  }

  draw(_d) {
    // _d.stroke(this.col)
    // _d.fill(this.col)
    _d.strokeWeight(1)
    _d.ellipse(this.x, this.y, DOT_SIZE)
  }
}


class Character {
  constructor(_x, _y)
  {
    this.x = _x
    this.y = _y
  }
  
  dist(_p) {
    return Math.hypot(this.x - _p.x, this.y - _p.y)
  }
  
  angleTo(_p) {
    return Math.atan2(_p.y - this.y, _p.x - this.x)
  }
}

const STEP_SIZE = 15
const DELAY = 5

class Path {
  constructor() {
    this.pts = []
    this.ptslead = []
    this.pts2 = []
  }

  draw(_d) {
    this.drawArray(_d, this.pts, 'red')
    _d.fill('black')
    _d.stroke('black')
    this.ptslead.forEach(_p => {
      _p.draw(_d)
    })

    for (let i = DELAY; i < this.ptslead.length; i++)
    {
      _d.line(this.ptslead[i].x, this.ptslead[i].y, this.pts2[i-DELAY].x, this.pts2[i-DELAY].y)
    }

    this.drawArray(_d, this.pts2, 'blue')
  }

  drawArray(_d, _list, _col)
  {
    _d.fill(_col)
    _d.stroke(_col)
    let i
    for (i = 0; i < _list.length - 1; i++) {
      _list[i].draw(_d)
      _d.line(_list[i].x, _list[i].y, _list[i+1].x, _list[i+1].y)
    }
    // draw last point, check that i is valid position (list could be empty)
    if (i < _list.length) _list[i].draw(_d)
  }

  interpolate()
  {
    this.pts2 = []
    this.ptslead = []
    let wp = 1

    let lead = new Character(this.pts[0].x, this.pts[0].y)
    let pos = new Character(this.pts[0].x, this.pts[0].y)

    for (let i = 0; i < DELAY; i ++)
    {
      if (this.getNextPos(lead, this.pts[wp], STEP_SIZE)) wp++
      if (wp >= this.pts.length) break;

      this.ptslead.push(new Point(lead.x, lead.y))
    }

    while (wp < this.pts.length)
    {
      let stepsize = (DELAY + 1) * STEP_SIZE - pos.dist(lead)
      if (this.getNextPos(lead, this.pts[wp], stepsize)) wp++
      
      let angle = pos.angleTo(lead)
      pos.x += Math.cos(angle) * STEP_SIZE
      pos.y += Math.sin(angle) * STEP_SIZE
      this.pts2.push(new Point(pos.x, pos.y))
      this.ptslead.push(new Point(lead.x, lead.y))
    }

    for (let i = 0; i < DELAY; i++)
    {
      let angle = pos.angleTo(lead)
      let dist = pos.dist(lead)
      if (dist > STEP_SIZE) dist = STEP_SIZE
      // to break out loop at end of this block
      else i = DELAY
      pos.x += Math.cos(angle) * dist
      pos.y += Math.sin(angle) * dist
      this.pts2.push(new Point(pos.x, pos.y))
    }
  }

  getNextPos(_char, _wp, _stepsize)
  {
    if (_char.dist(_wp) < _stepsize) {
      _char.x = _wp.x
      _char.y = _wp.y
      return true
    } else {
      let angle = _char.angleTo(_wp)
      _char.x += Math.cos(angle) * _stepsize
      _char.y += Math.sin(angle) * _stepsize
    }

  }
}

let path = new Path()

let setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  d.c.addEventListener('click', mouseclickHandler, false)  
  windowResize()

  // path.pts.push(new Point(650,106))
  // path.pts.push(new Point(220,296))
  // path.pts.push(new Point(113,498))
  // path.pts.push(new Point(409,755))
  // path.pts.push(new Point(717,809))
  // path.pts.push(new Point(837,669))
  // path.pts.push(new Point(830,447))
  // path.pts.push(new Point(727,341))
  // path.pts.push(new Point(487,627))
  // path.pts.push(new Point(550,290))
  // path.pts.push(new Point(689,631))
  // path.pts.push(new Point(263,421))
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
  
  path.draw(d)
}

window.onresize = function(event) {
  windowResize()
  draw()
}

let tick = () => {
  draw()
}

let mouseclickHandler = (e) => {
  let p = new Point(e.clientX, e.clientY)
  path.pts.push(p)
}

setup()
setInterval(tick, 1000 / 60);
