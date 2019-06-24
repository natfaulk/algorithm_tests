const DOT_SIZE = 5

class Quadtree {
  constructor(_centre, _width, _height) {
    this.top = new QtreeLeaf(_centre, _width, _height)
  }

  draw(_d) {
    this.top.draw(_d)
  }

  add(_p) {
    this.top.add(_p)
  }
}

class Point {
  constructor(_x, _y) {
    this.x = _x
    this.y = _y
  }

  draw(_d) {
    _d.stroke('black')
    _d.fill('blue')
    _d.strokeWeight(1)
    _d.ellipse(this.x, this.y, DOT_SIZE)
  }
}

class QtreeLeaf {
  constructor(_centre, _width, _height) {
    this.children = Array(4).fill(null)
    this.centre = _centre
    this.width = _width
    this.height = _height
  }

  add(_p) {
    let index = 0
    if (_p.x > this.centre.x) index += 1
    if (_p.y > this.centre.y) index += 2
    if (this.children[index] === null) {
      this.children[index] = new Point(_p.x, _p.y)
    } else if (this.children[index] instanceof QtreeLeaf) {
      this.children[index].add(_p)
    } else {
      let temp = this.children[index]
      let newCentre = {
        x: this.centre.x - this.width / 4,
        y: this.centre.y - this.height / 4
      }
      
      if (index % 2 === 1) newCentre.x += this.width / 2
      if (index >= 2) newCentre.y += this.height / 2

      this.children[index] = new QtreeLeaf(
        newCentre,
        this.width / 2,
        this.height / 2
      )

      this.children[index].add(temp)
      this.children[index].add(_p)
    }
  }

  draw(_d)
  {
    _d.fill('#00000000')
    _d.stroke('red')
    _d.strokeWeight(2)
    // _d.rect(this.centre.x - this.width / 2, this.centre.y - this.height / 2, this.width - 2, this.height - 2)
    _d.line(this.centre.x, this.centre.y - this.height / 2, this.centre.x, this.centre.y + this.height / 2)
    _d.line(this.centre.x - this.width / 2, this.centre.y, this.centre.x + this.width / 2, this.centre.y)

    this.children.forEach(_c => {
      if (_c !== null) {
        _c.draw(_d)
      }
    })
  }
}