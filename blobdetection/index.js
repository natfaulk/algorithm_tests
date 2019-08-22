const SQ_SIZE = 10
const GRID_WIDTH = 6
const GRID_HEIGHT = 6

let matrix = []
let blobs = []
let BBs = []

let setup = () => {
  d = new Mindrawingjs()
  d.setup('myCanvas')
  d.c.addEventListener('click', mouseclickHandler, false)  
  windowResize()

  regen()
}

let regen = () => {
  matrix = []
  blobs = []
  BBs = []

  for (let x = 0; x < GRID_WIDTH; x++) {
    let temp = []
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let val = Math.round(Math.pow(Math.random(), 5) * 255)
      if (val <= 100) val = 0
      temp.push(val)
    }
    matrix.push(temp)
  }

  matrix = interp2d(matrix, 5)
  
  // horrible hack to deep copy array
  let matrix2 = JSON.parse(JSON.stringify(matrix))

  threshold(matrix2, 50)
  blobs = findBlobs(matrix2)
  console.log(blobs)

  blobs.forEach(_blob => {
    BBs.push(getBlobBB(_blob))
  })
}

let windowResize = () => {
  let rect = d.c.parentNode.getBoundingClientRect()
  d.setCanvasSize(rect.width, rect.height)
}

let draw = () => {
  const t_width = matrix.length
  const t_height = matrix[0].length

  d.ctx.clearRect(0, 0, d.c.width, d.c.height)

  let xoffset = (d.width - t_width * SQ_SIZE) / 2
  let yoffset = (d.height - t_height * SQ_SIZE) / 2

  for (let x = 0; x < t_width; x++) {
    for (let y = 0; y < t_height; y++) {
      let col = matrix[x][y]
      d.fill(`rgb(${col}, ${col}, ${col})`)
      d.stroke(`rgb(${col}, ${col}, ${col})`)
      d.rect(xoffset + x * SQ_SIZE, yoffset + y * SQ_SIZE, SQ_SIZE, SQ_SIZE)
    }
  }

  const DOT_SIZE = 2
  
  d.fill('red')
  d.stroke('red')
  blobs.forEach(blob => {
    blob.forEach(dot => {
      // + 0.5 to centre on the square
      d.ellipse(xoffset + ((dot.x + 0.5) * SQ_SIZE), yoffset + ((dot.y + 0.5) * SQ_SIZE), DOT_SIZE)
    })
  })

  d.fill('transparent')
  d.stroke('green')
  BBs.forEach(_bb => {
    d.rect(
      xoffset + _bb.x * SQ_SIZE,
      yoffset + _bb.y * SQ_SIZE,
      _bb.w * SQ_SIZE,
      _bb.h * SQ_SIZE
      )
  })

}

window.onresize = function(event) {
  windowResize()
  draw()
}

let tick = () => {
  draw()
}

let mouseclickHandler = (e) => {
  // applyKernel()
}

let threshold = (_matrix, _val) => {
  for (let x = 0; x < _matrix.length; x++) {
    for (let y = 0; y < _matrix[x].length; y++) {
      if (_matrix[x][y] > _val) _matrix[x][y] = 255
      else _matrix[x][y] = 0
    }
  }
}

let findBlobs = _matrix => {
  let visited = new Set()
  let blobs = []
  
  const t_width = _matrix.length
  const t_height = _matrix[0].length
  
  const setKey = (_x, _y) => _x + _y * t_width
  
  for (let x = 0; x < t_width; x++) {
    for (let y = 0; y < t_height; y++) {
      if (!visited.has(setKey(x, y))) {
        
        if (_matrix[x][y] == 0) visited.add(setKey(x, y))
        else {
          let _blob = getConnected(_matrix, x, y)
          blobs.push(_blob)
          _blob.forEach(_b => {
            visited.add(setKey(_b.x, _b.y))
          })
        }
      }
    }
  }
  
  return blobs
}

let getConnected = (_matrix, x, y) => {
  const t_width = _matrix.length
  const t_height = _matrix[0].length

  let toSearch = [{x, y}]
  let out = []

  const setKey = (_x, _y) => _x + _y * t_width
  let visited = new Set([setKey(x, y)])

  while (toSearch.length > 0) {
    let temp = toSearch.pop()
    out.push(temp)

    if (
      !visited.has(setKey(temp.x, temp.y - 1))
      && (temp.y - 1) >= 0
      && _matrix[temp.x][temp.y - 1] > 0
      ) toSearch.push({x: temp.x, y: temp.y - 1})

    if (
      !visited.has(setKey(temp.x, temp.y + 1))
      && (temp.y + 1) < t_height
      && _matrix[temp.x][temp.y + 1] > 0
      ) toSearch.push({x: temp.x, y: temp.y + 1})

    if (
      !visited.has(setKey(temp.x - 1, temp.y))
      && (temp.x - 1) >= 0
      && _matrix[temp.x - 1][temp.y] > 0
      ) toSearch.push({x: temp.x - 1, y: temp.y})

    if (
      !visited.has(setKey(temp.x + 1, temp.y))
      && _matrix[temp.x + 1][temp.y] > 0
      && (temp.x + 1) < t_width
      ) toSearch.push({x: temp.x + 1, y: temp.y})

    visited.add(setKey(temp.x, temp.y - 1))
    visited.add(setKey(temp.x, temp.y + 1))
    visited.add(setKey(temp.x - 1, temp.y))
    visited.add(setKey(temp.x + 1, temp.y))
  }

  return out
}

// get blob Bounding Box
// returns {x, y, w, h}
let getBlobBB = _blob => {
  let xmin = _blob[0].x
  let xmax = xmin
  let ymin = _blob[0].y
  let ymax = ymin

  for (let i = 1; i < _blob.length; i++) {
    if (_blob[i].x < xmin) xmin = _blob[i].x
    if (_blob[i].x > xmax) xmax = _blob[i].x
    if (_blob[i].y < ymin) ymin = _blob[i].y
    if (_blob[i].y > ymax) ymax = _blob[i].y
  }

  return {x: xmin, y: ymin, w: (xmax - xmin) + 1, h: (ymax - ymin) + 1}
}

setup()
setInterval(tick, 1000 / 60);
