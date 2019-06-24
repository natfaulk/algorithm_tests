const N_DOTS = 50
let showText = true

let d
let q

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

  q = new Quadtree({x: d.c.width / 2, y:d.c.height / 2}, d.c.width, d.c.height)
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.c.width = rect.width
  d.c.height = rect.height
}

let draw = () => {
  d.ctx.clearRect(0, 0, d.c.width, d.c.height)

  q.draw(d)

  if (showText) {
    let txtSize = 80
    d.textSize(txtSize)
    d.fill('#00000088')
    let txt = "Click to add points"

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

let tick = () => {
  draw()
}

let mouseclickHandler = (e) => {
  showText = false
  q.add({x:e.clientX, y:e.clientY})
}

setup()
setInterval(tick, 1000 / 60);
