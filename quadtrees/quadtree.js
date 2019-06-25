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

  getLeaf(_p) {
    return this.top.getLeaf(_p)
  }
  
  knn(_p, n) {
    let pq = new PriorityQueue()
    let out = []

    // can assign any value due to it being first item
    pq.enqueue(this.top, 0)

    while (pq.size() > 0) {
      let temp = pq.dequeue()
      if (temp instanceof Point) {
        out.push(temp)
        if (out.length >= n) return out
      } else {
        temp.children.forEach(_t => {
          if (_t !== null) {
            pq.enqueue(_t, minDist(_p, _t))
          }
        })
      }
    }

    console.log('less than n items found')
    return out
  }
}

class PriorityQueue {
  constructor() {
    this.data = []
  }

  dequeue() {
    if (this.data.length === 0) return undefined
    return this.data.shift().item
  }

  enqueue(_item, _priority) {
    if (Number.isNaN(_priority)) {
      console.log('_priority NaN!!')
    }
    let i = 0;
    for (i = 0; i < this.data.length; i++) {
      if (_priority < this.data[i].priority) {
        this.data.splice(i, 0, {item:_item, priority: _priority})
        return
      }
    }
    // in case bigger than all items
    this.data.push({item:_item, priority: _priority})
  }

  size() {
    return this.data.length
  }
}

let minDist = (_dest, _p) => {
  if (_p instanceof Point) {
    return Math.hypot(_dest.y - _p.y, _dest.x - _p.x)
  }

  if (_p instanceof QtreeLeaf) {
    let xbounded = (_dest.x > (_p.centre.x - _p.width / 2)) && (_dest.x < (_p.centre.x + _p.width / 2)) 
    let ybounded = (_dest.y > (_p.centre.y - _p.height / 2)) && (_dest.y < (_p.centre.y + _p.height / 2))
    
    // inside the square
    if (xbounded && ybounded) return 0

    // x within square
    if (xbounded) {
      if (_dest.y < _p.centre.y) return (_p.centre.y - _p.height / 2) - _dest.y
      else return _dest.y - (_p.centre.y + _p.height / 2)
    }

    // y within square
    if (ybounded) {
      if (_dest.x < _p.centre.x) return (_p.centre.x - _p.width / 2) - _dest.x
      else return _dest.x - (_p.centre.x + _p.width / 2)
    }

    // else get distance to nearest corner
    if (_dest.x < _p.centre.x && _dest.y < _p.centre.y) return Math.hypot(_dest.y - (_p.centre.y - _p.height / 2), _dest.x - (_p.centre.x - _p.width / 2))
    if (_dest.x < _p.centre.x && _dest.y > _p.centre.y) return Math.hypot(_dest.y - (_p.centre.y + _p.height / 2), _dest.x - (_p.centre.x - _p.width / 2))
    if (_dest.x > _p.centre.x && _dest.y < _p.centre.y) return Math.hypot(_dest.y - (_p.centre.y - _p.height / 2), _dest.x - (_p.centre.x + _p.width / 2))
    if (_dest.x > _p.centre.x && _dest.y > _p.centre.y) return Math.hypot(_dest.y - (_p.centre.y + _p.height / 2), _dest.x - (_p.centre.x + _p.width / 2))

    console.log('shouldnt ever reach here....', xbounded, ybounded, _dest, _p)
  } else {
    console.log('error not point or QtreeLeaf')
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

  getLeaf(_p) {
    let index = 0
    if (_p.x > this.centre.x) index += 1
    if (_p.y > this.centre.y) index += 2

    if (this.children[index] instanceof QtreeLeaf) return this.children[index].getLeaf(_p)
    else {
      let tempCentre = {
        x: this.centre.x - this.width / 4,
        y: this.centre.y - this.height / 4
      }
      
      if (index % 2 === 1) tempCentre.x += this.width / 2
      if (index >= 2) tempCentre.y += this.height / 2

      tempCentre.w = this.width / 2
      tempCentre.h = this.height / 2

      tempCentre.empty = (this.children[index] === null)
      
      return tempCentre
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