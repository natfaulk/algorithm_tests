const N_DOTS = 1000
const K = 10

let showText = true

let d
let q

let circs = []

class Circ {
  constructor(_x, _y, _col)
  {
    this.x = _x
    this.y = _y
    this.col = _col
  }

  draw(_d) {
    _d.fill(this.col)
    _d.ellipse(this.x, this.y, 10)
  }
}

// let sq = {
//   show: false,
//   x: 0,
//   y: 0,
//   w: 0,
//   h: 0,
//   empty: false,
//   draw: function (_d) {
//     if (this.empty) _d.fill('#FF000080')
//     else _d.fill('#0000FF80')
//     _d.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
//   }
// }

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
  // d.c.addEventListener('mousemove', mousemoveHandler, false)
  windowResize()

  q = new Quadtree({x: d.c.width / 2, y:d.c.height / 2}, d.c.width, d.c.height)
  
  for (let i = 0; i < N_DOTS; i++) {
    q.add({x:Math.random() * d.c.width, y:Math.random() * d.c.height})
  }

  draw()
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.c.width = rect.width
  d.c.height = rect.height
}

let draw = () => {
  d.ctx.clearRect(0, 0, d.c.width, d.c.height)
  
  // if (sq.show) sq.draw(d)
  q.draw(d)

  circs.forEach(_c => {
    _c.draw(d)
  })

  if (showText) {
    let txtSize = 80
    d.textSize(txtSize)
    d.fill('#00000088')
    let txt = "Click to find nearest points"

    while (d.ctx.measureText(txt).width > d.c.width)
    {
      txtSize *= 2/3
      d.textSize(txtSize)
    }

    d.text(txt, (d.c.width - d.ctx.measureText(txt).width) / 2, d.c.height / 3)
  }
}

window.onresize = function(event) {
  windowResize()
  draw()
}

// let tick = () => {
//   draw()
// }

let mouseclickHandler = e => {
  showText = false
  circs = [new Circ(e.clientX, e.clientY, '#FF00FF')]
  let temp = q.knn({x:e.clientX, y:e.clientY}, K)
  temp.forEach(_t => {
    circs.push(new Circ(_t.x, _t.y, 'red'))
  })
  draw()
}

// let mousemoveHandler = e => {
//   let p = q.getLeaf({x:e.clientX, y:e.clientY})
//   sq.show = true
//   sq.x = p.x
//   sq.y = p.y
//   sq.w = p.w
//   sq.h = p.h
//   sq.empty = p.empty
// }

setup()
// setInterval(tick, 1000 / 60);
