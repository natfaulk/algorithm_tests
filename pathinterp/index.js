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

const STEP_SIZE = 12
const DELAY = 5

class Path {
  constructor() {
    this.pts = []
    this.pts2 = []
  }

  draw(_d) {
    this.drawArray(_d, this.pts, 'red')
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

  interpolate2(_p) {
    this.pts.push(new Point(_p.x, _p.y))
    if (this.pts2.length == 0)
    {
      this.pts2.push(new Point(_p.x, _p.y))
      return
    }

    if (this.pts2.length == 1)
    {
      let follower = new Character(this.pts2[0].x, this.pts2[0].y)
      
      while (follower.dist(_p) > STEP_SIZE)
      {
        let ang = follower.angleTo(_p);
        let dist = follower.dist(_p);
        if (dist > STEP_SIZE) dist = STEP_SIZE;
        follower.x += Math.cos(ang) * dist
        follower.y += Math.sin(ang) * dist
        this.pts2.push(new Point(follower.x, follower.y));
      }
      return
    }

    let oldLast = this.pts2[this.pts2.length - 1];
    if (this.pts2.length <= DELAY) this.pts2 = []
    else {
      for (let i = 0; i < DELAY; i++) this.pts2.pop() 
    }

    if (this.pts2.length == 0) {
      this.pts2.push(this.pts[0])
    }

    let lead = new Character(oldLast.x, oldLast.y)
    let follow = new Character(this.pts2[this.pts2.length - 1].x, this.pts2[this.pts2.length - 1].y)

    while (lead.dist(_p) > STEP_SIZE)
    {
      let stepsize = (DELAY + 1) * STEP_SIZE - follow.dist(lead)
      // if (this.getNextPos(lead, this.pts[wp], stepsize)) wp++
      let angle = lead.angleTo(_p)
      lead.x += Math.cos(angle) * stepsize
      lead.y += Math.sin(angle) * stepsize
      
      angle = follow.angleTo(lead)
      follow.x += Math.cos(angle) * STEP_SIZE
      follow.y += Math.sin(angle) * STEP_SIZE
      this.pts2.push(new Point(follow.x, follow.y))
      // this.ptslead.push(new Point(lead.x, lead.y))
    }
    lead.x = _p.x
    lead.y = _p.y

    for (let i = 0; i < DELAY + 1; i++)
    {
      let angle = follow.angleTo(lead)
      let dist = follow.dist(lead)
      if (dist > STEP_SIZE) dist = STEP_SIZE
      // to break out loop at end of this block
      else i = DELAY
      follow.x += Math.cos(angle) * dist
      follow.y += Math.sin(angle) * dist
      this.pts2.push(new Point(follow.x, follow.y))
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

  clear()
  {
    this.pts = []
    this.pts2 = []
  }
}

let path = new Path()

let setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  d.c.addEventListener('click', mouseclickHandler, false)  
  windowResize()

  path.interpolate2(new Point(650,106))
  path.interpolate2(new Point(220,296))
  path.interpolate2(new Point(113,498))
  path.interpolate2(new Point(409,755))
  path.interpolate2(new Point(717,809))
  path.interpolate2(new Point(837,669))
  path.interpolate2(new Point(830,447))
  path.interpolate2(new Point(727,341))
  path.interpolate2(new Point(487,627))
  path.interpolate2(new Point(550,290))
  path.interpolate2(new Point(689,631))
  path.interpolate2(new Point(263,421))
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
  path.interpolate2(p)
}

setup()
setInterval(tick, 1000 / 60);
