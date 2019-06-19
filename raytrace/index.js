const BLOB_WIDTH = 50

let d
let blobI = 0
let blobs = []
let rects = []
let showHelp = true;

class Blob {
  constructor(_x, _y, _d, _c) {
    this.x = _x
    this.y = _y
    this.d = _d
    this.col = _c
    this.drag = false
  }

  draw() {
    this.d.fill(this.col)
    this.d.ellipse(this.x, this.y, BLOB_WIDTH)
  }
}

class Rect1 {
  constructor(_x, _y, _w, _h, _d)
  {
    this.x = _x
    this.y = _y
    this.w = _w
    this.h = _h
    this.d = _d

    this.intersects = {
      top: false,
      right: false,
      bottom: false,
      left: false
    }
  }

  draw() {
    this.d.fill('#FFF')
    this.d.rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    this.d.fill('red')
    if (this.intersects.top) this.d.rect(this.x - this.w/2, -5 + this.y - this.h/2, this.w, 5);
    if (this.intersects.bottom) this.d.rect(this.x - this.w/2, this.y + this.h/2, this.w, 5);
    if (this.intersects.left) this.d.rect(-5 + this.x - this.w/2, this.y - this.h/2, 5, this.h);
    if (this.intersects.right) this.d.rect(this.x + this.w/2, this.y - this.h/2, 5, this.h);
  }
}

let setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  d.c.addEventListener('click', mouseclickHandler, false)
  d.c.addEventListener('mousedown', mousedownHandler, false)
  d.c.addEventListener('mouseup', mouseupHandler, false)
  d.c.addEventListener('mousemove', mousemoveHandler, false)
  d.c.addEventListener('touchstart', touchdownHandler, false)
  d.c.addEventListener('touchend', mouseupHandler, false)
  d.c.addEventListener('touchmove', touchmoveHandler, false)

  windowResize()

  blobs.push(new Blob(20, 20, d, 'red'))
  blobs.push(new Blob(200, 200, d, 'blue'))

  for (let i = 0; i < Math.max(d.c.height * d.c.width / 40000, 10); i++)
  {
    rects.push(new Rect1(Math.random()*d.c.width, Math.random()*d.c.height, 20 + Math.random()*180, 20 + Math.random()*180, d))
  }
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.c.width = rect.width
  d.c.height = rect.height
}

let draw = () => {
  d.ctx.clearRect(0, 0, d.c.width, d.c.height)
  rects.forEach(_r => {
    lineThroughSquare(blobs[0], blobs[1], _r)
    _r.draw()
  })
  blobs.forEach(_b => {
    _b.draw()
  })

  d.strokeWeight(1)
  d.line(blobs[0].x, blobs[0].y, blobs[1].x, blobs[1].y)

  if (showHelp) {
    d.fill('#ffffff80')
    d.rect(0, 0, d.c.width, d.c.height)

    let txtSize = 40
    d.textSize(txtSize)
    d.fill('#222')
    let txt = "Click and drag blobs to move them"
    let txt2 = "Click to hide this message"

    while (d.ctx.measureText(txt).width > d.c.width)
    {
      txtSize *= 2/3
      d.textSize(txtSize)
    }

    d.text(txt, (d.c.width - d.ctx.measureText(txt).width) / 2, d.c.height / 3)
    d.textSize(txtSize / 2)
    d.text(txt2, (d.c.width - d.ctx.measureText(txt2).width) / 2, d.c.height / 3 + txtSize)

  }
}

window.onresize = function(event) {
  windowResize()
  draw()
}

let mouseclickHandler = (e) => {
  showHelp = false
}

let mousedownHandler = (e) => {
  for (let i = 0; i < blobs.length; i++) {
    if (Math.hypot(e.clientY - blobs[i].y, e.clientX - blobs[i].x) <= BLOB_WIDTH / 2)
    {
      blobs[i].drag = true
    }
  }
}

let touchdownHandler = (e) => {
  e.preventDefault()
  for (let i = 0; i < blobs.length; i++) {
    if (Math.hypot(e.touches[0].clientY - blobs[i].y, e.touches[0].clientX - blobs[i].x) <= BLOB_WIDTH / 2)
    {
      blobs[i].drag = true
    }
  }
}

let mouseupHandler = (e) => {
  blobs.forEach(_b => {
    _b.drag = false
  })
}

let mousemoveHandler = (e) => {
  for (let i = 0; i < blobs.length; i++) {
    if (blobs[i].drag === true) {
      blobs[i].x = e.clientX
      blobs[i].y = e.clientY
      break
    }
  }
}

let touchmoveHandler = (e) => {
  e.preventDefault()
  for (let i = 0; i < blobs.length; i++) {
    if (blobs[i].drag === true) {
      blobs[i].x = e.touches[0].clientX
      blobs[i].y = e.touches[0].clientY
      break
    }
  }
}

let tick = () => {
  draw()
}

let lineThroughSquare = (_l1, _l2, _r) => {
  let angle = Math.atan2(_l2.y - _l1.y, _l2.x - _l1.x)

  let l = _r.x-_r.w/2
  let r = _r.x+_r.w/2
  let t = _r.y+_r.h/2
  let b = _r.y-_r.h/2

  let getY = _x => _l1.y + Math.tan(angle) * (_x - _l1.x)
  let getX = _y => _l1.x + (_y - _l1.y) / Math.tan(angle)

  let tempY = getY(r)
  _r.intersects.right = (tempY > b && tempY < t && Math.min(_l1.x, _l2.x) < r && Math.max(_l1.x, _l2.x) > r) 
  tempY = getY(l)
  _r.intersects.left = (tempY > b && tempY < t && Math.min(_l1.x, _l2.x) < l && Math.max(_l1.x, _l2.x) > l)
  tempY = getX(t)
  _r.intersects.bottom = (tempY > l && tempY < r  && Math.min(_l1.y, _l2.y) < t && Math.max(_l1.y, _l2.y) > t)
  tempY = getX(b)
  _r.intersects.top = (tempY > l && tempY < r && Math.min(_l1.y, _l2.y) < b && Math.max(_l1.y, _l2.y) > b)
}

setup()
setInterval(tick, 1000 / 60);
