const DOTSIZE = 5
const N_DOTS = 1000

const N_NEIGHBOURS = 3

let d
let dots = [];

class Dot {
  constructor(_x, _y, _d, _c) {
    this.x = _x
    this.y = _y
    this.d = _d
    this.col = _c

    this.force = {x:0,y:0}
  }

  draw() {
    this.d.stroke('black')
    this.d.fill(this.col)
    this.d.ellipse(this.x, this.y, DOTSIZE)
  }

  applyForce() {
    this.x += this.force.x
    this.y += this.force.y
    this.force = {x:0,y:0}
  }
}

let randomColour = () => {
  let num = Math.round(0xFFFFFF * Math.random())
  let str = num.toString(16)
  while (str.length < 6) str = '0' + str
  return '#' + str 
}

let setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  d.c.addEventListener('click', mouseclickHandler, false)  
  windowResize()

  for (let i = 0; i < N_DOTS; i++) {
    let t_x = d.c.width * Math.random()
    let t_y = d.c.height * Math.random()
    dots.push(new Dot(t_x, t_y, d, randomColour()))
  }
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.c.width = rect.width
  d.c.height = rect.height
}

let draw = () => {
  d.ctx.clearRect(0, 0, d.c.width, d.c.height)
  
  dots.forEach(_d => {
    _d.draw()
  })

  let txtSize = 80
  d.textSize(txtSize)
  d.fill('#00000088')
  let txt = "Click to advance a step"

  while (d.ctx.measureText(txt).width > d.c.width)
  {
    txtSize *= 2/3
    d.textSize(txtSize)
  }

  d.text(txt, (d.c.width - d.ctx.measureText(txt).width) / 2, d.c.height / 3)
}

window.onresize = function(event) {
  windowResize()
  draw()
}

let tick = () => {
  draw()
}

let mouseclickHandler = (e) => {
  let av = 0
  let count = 0

  let nn_cache = []

  let q = new Quadtree({x: d.c.width / 2, y:d.c.height / 2}, d.c.width, d.c.height)
  for (let i = 0; i < dots.length; i++) {
    q.add(dots[i])
  }

  for (let i = 0; i < dots.length; i++)
  {
    let ns = q.knn(dots[i], N_NEIGHBOURS + 1)
    let ns2 = []
    ns.forEach(_n => {
      // dont compare dot with itself
      if (_n.x != dots[i].x && _n.y != dots.y) {
        let dist = Math.hypot(dots[i].y - _n.y, dots[i].x - _n.x) 
        av += dist
        ++count
        ns2.push({
          dist:dist,
          dot: {
            x:_n.x,
            y:_n.y
          }
        })
      }
    })

    nn_cache.push({d:dots[i], ns: ns2})
  }
  
  av /= count
  console.log(av)

  nn_cache.forEach(obj => {
    let d1 = obj.d
    d1.force = {x:0, y:0}

    obj.ns.forEach((_n) => {
      let d2 = _n.dot
      let delta = (_n.dist - av) / 2
      let angle = Math.atan2(d2.y - d1.y, d2.x - d1.x)
      d1.force.x += Math.cos(angle) * delta
      d1.force.y += Math.sin(angle) * delta
    })
  })

  dots.forEach(_d => {
    _d.applyForce()
  })
}

setup()
setInterval(tick, 1000 / 60);
