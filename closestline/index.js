let lines = []

let mousePos = {x: 0, y: 0}
const mousemoveHandler = e => {
  let rect = document.getElementById('myCanvas').getBoundingClientRect()
  mousePos.x = e.clientX - rect.left
  mousePos.y = e.clientY - rect.top
}

const setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  window.addEventListener('mousemove', mousemoveHandler, false)

  windowResize()
  
  for (let i = 0; i < 20; i++) {
    let pt1 = {
      x: Math.random() * d.width,
      y: Math.random() * d.height
    }

    let pt2 = {
      x: Math.random() * d.width,
      y: Math.random() * d.height
    }

    lines.push({pt1, pt2})
  }
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.setCanvasSize(rect.width, rect.height)
}

let draw = () => {
  d.ctx.clearRect(0, 0, d.c.width, d.c.height)
  d.stroke('white')
  d.fill('white')

  d.stroke('red')
  d.fill('red')

  let closest = null
  let closest_d = 0
  lines.forEach(_l => {
    d.ellipse(_l.pt1.x, _l.pt1.y)
    d.ellipse(_l.pt2.x, _l.pt2.y)
    d.line(_l.pt1.x, _l.pt1.y, _l.pt2.x, _l.pt2.y)

    let c = getClosestPoint(_l.pt1, _l.pt2, mousePos)
    let temp_d = Math.hypot(c.x - mousePos.x, c.y - mousePos.y)
    if (closest === null || temp_d < closest_d) {
      closest = c
      closest_d = temp_d
    }
  })
  
  d.ellipse(closest.x, closest.y, 10)
  d.stroke('blue')
  d.line(closest.x, closest.y, mousePos.x, mousePos.y)
}

window.onresize = function(event) {
  windowResize()
  draw()
}

// a and b are the endpoints of the line, p is the point
const getClosestPoint = (a, b, p) => {
  let atop = {
    x: p.x - a.x,
    y: p.y - a.y
  }

  let atob = {
    x: b.x - a.x,
    y: b.y - a.y
  }

  let atob_magsq = Math.pow(atob.x, 2) + Math.pow(atob.y, 2)
  let atop_dot_atob = atop.x*atob.x + atop.y*atob.y

  
  let t = atop_dot_atob / atob_magsq
  
  if (t <= 0) return a
  if (t >= 1) return b

  let out = {
    x: a.x + atob.x*t,
    y: a.y + atob.y*t
  }

  return out
}

const tick = () => {
  draw()

  requestAnimationFrame(tick)
}

setup()
requestAnimationFrame(tick)
