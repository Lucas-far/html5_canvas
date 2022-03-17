const canvas = document.querySelector('canvas')
const cv = canvas.getContext('2d') // var biblioteca

// Alternativo: window.innerWidth / window.innerHeight
canvas.width = 640
canvas.height = 640

const shapes = ['circle', 'line', 'rectangle', 'global']
const sizes = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]

// ========== UTILIDADES ==========
function randomIndex(targetVar) {
  const index = Math.floor(Math.random() * targetVar.length)
  return index
}

function location() {
  let globalLength = []

  for (let i = 0; i < 1366; i++) {
    globalLength.push(i)
  }

  return Math.random() * globalLength[randomIndex(globalLength)]
}

function locationCanvas({ measure, targetSize = 0 }) {
  let canvasWidth = []
  let canvasHeight = []

  if (measure == 'width') {
    for (let i = targetSize; i < canvas.width - targetSize; i++) {
      canvasWidth.push(i)
    }
    return canvasWidth[randomIndex(canvasWidth)]
  } else if (measure == 'height') {
    for (let i2 = targetSize; i2 < canvas.height - targetSize; i2++) {
      canvasHeight.push(i2)
    }
    return canvasHeight[randomIndex(canvasHeight)]
  }
}

function rgbTable() {
  let arrayVar = []

  for (let i = 0; i < 255; i++) {
    arrayVar.push(i)
  }

  let red = arrayVar[randomIndex(arrayVar)]
  let green = arrayVar[randomIndex(arrayVar)]
  let blue = arrayVar[randomIndex(arrayVar)]

  return `rgba(${red},${green},${blue})`
}

function speedRate() {
  const values = [
    Math.random(),
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
    1,
    2,
    3,
    4,
    5
  ]
  return values[randomIndex(values)]
}

// ========== RETÂNGULO ==========
// Pars: x, y, w, h
function doRect({ p1 = 10, p2 = 30, p3 = 20, p4 = 20, color }) {
  cv.fillStyle = color
  cv.fillRect(p1, p2, p3, p4)
}

// ========== LINHA ==========
// Cor da linha: (nome, rgb, hexa)
// EXEMPLOS: 'yellow'    'rgba(255,0,100)'    '#222222'

// CRIAÇÃO
// moveTo (p1) Alcance horizontal (quanto maior, mais próximo)
// moveTo (p2) Alcance vertical (quanto maior, mais próximo)
// lineTo (p3) Distância da linha do lado esquerdo
// lineTo (p4) Distância da linha do topo
function doLine({ p1 = 200, p2 = 200, p3 = 333, p4 = 333, color }) {
  cv.beginPath()
  cv.strokeStyle = color
  cv.moveTo(p1, p2)
  cv.lineTo(p3, p4)
  cv.stroke()
}

// ========== ARCO/CÍRCULO ==========
// p1 = distância do lado <-
// p2 = distância do teto
// p3 = tamanho
// p4 = 0 (círculo completo)
// p5 = não sei
function doCircle({
  p1 = 200,
  p2 = 300,
  p3 = 10,
  p4 = 0,
  p5 = Math.PI * 2,
  p6 = false,
  color = 'green'
}) {
  cv.beginPath()
  cv.strokeStyle = color
  cv.arc(p1, p2, p3, p4, p5, p6)
  cv.stroke()
}

// ========== CHAMAR MÚLTIPLOS ==========
function doMultiple({ amount, shape }) {
  for (let i = 0; i < amount; i++) {
    if (shape == 'circle') {
      doCircle({
        p1: locationCanvas({ measure: 'width' }),
        p2: locationCanvas({ measure: 'height' }),
        color: rgbTable()
      })
    } else if (shape == 'line') {
      doLine({
        p1: locationCanvas({ measure: 'width' }),
        p2: locationCanvas({ measure: 'height' }),
        p3: locationCanvas({ measure: 'width' }),
        p4: locationCanvas({ measure: 'height' }),
        color: rgbTable()
      })
    } else if (shape == 'rectangle') {
      doRect({
        p1: locationCanvas({ measure: 'width' }),
        p2: locationCanvas({ measure: 'height' }),
        p3: sizes[randomIndex(sizes)],
        p4: sizes[randomIndex(sizes)],
        color: rgbTable()
      })
    } else if (shape == 'global') {
      doCircle({
        p1: locationCanvas({ measure: 'width' }),
        p2: locationCanvas({ measure: 'height' }),
        color: rgbTable()
      })
      doLine({
        p1: locationCanvas({ measure: 'width' }),
        p2: locationCanvas({ measure: 'height' }),
        p3: locationCanvas({ measure: 'width' }),
        p4: locationCanvas({ measure: 'height' }),
        color: rgbTable()
      })
      doRect({
        p1: locationCanvas({ measure: 'width' }),
        p2: locationCanvas({ measure: 'height' }),
        p3: sizes[randomIndex(sizes)],
        p4: sizes[randomIndex(sizes)],
        color: rgbTable()
      })
    }
  }
}

// let allShapes = doMultiple({ amount: 200, shape: shapes[randomIndex(shapes)] })

let sphereRadius = 30
let sphereX = locationCanvas({ measure: 'width', targetSize: sphereRadius })
let sphereY = locationCanvas({ measure: 'height', targetSize: sphereRadius })
let forwardSpeed = speedRate()
let backwardsSpeed = speedRate()

console.log(`${sphereX} ${sphereY} ${forwardSpeed} ${backwardsSpeed}`)

class Circle {
  constructor({ x, y, forwardSpeed, backwardsSpeed, sphereRadius = 30 }) {
    this.x = x
    this.y = y
    this.forwardSpeed = forwardSpeed
    this.backwardsSpeed = backwardsSpeed
    this.sphereRadius = sphereRadius
  }

  draw() {
    cv.beginPath()
    cv.strokeStyle = rgbTable()
    cv.arc(this.x, this.y, this.sphereRadius, 0, Math.PI * 2, false)
    cv.stroke()
  }

  update() {
    if (
      this.x + this.sphereRadius >= canvas.width ||
      this.x < this.sphereRadius
    ) {
      this.forwardSpeed = -this.forwardSpeed
    }

    if (
      this.y + this.sphereRadius >= canvas.height ||
      this.y < this.sphereRadius
    ) {
      this.backwardsSpeed = -this.backwardsSpeed
    }

    this.x += this.forwardSpeed
    this.y += this.backwardsSpeed
  }
}

let circles = []

function init() {
  for (let i = 0; i < 50; i++) {
    let new_sphere = new Circle({
      x: locationCanvas({ measure: 'width', targetSize: sphereRadius }),
      y: locationCanvas({ measure: 'height', targetSize: sphereRadius }),
      forwardSpeed: speedRate(),
      backwardsSpeed: speedRate()
    })
    circles.push(new_sphere)
  }
}

function animate() {
  requestAnimationFrame(animate)

  cv.clearRect(0, 0, innerHeight, innerHeight)

  circles.forEach(circle => {
    circle.draw()
    circle.update()
  })

  cv.beginPath()
  cv.strokeStyle = rgbTable()
  cv.arc(sphereX, sphereY, 30, 0, Math.PI * 2, false)
  cv.stroke()

  if (sphereX + sphereRadius >= canvas.width || sphereX < sphereRadius) {
    forwardSpeed = -forwardSpeed
  }

  if (sphereY + sphereRadius >= canvas.height || sphereY < sphereRadius) {
    backwardsSpeed = -backwardsSpeed
  }

  sphereX += forwardSpeed
  sphereY += backwardsSpeed
}

init()
animate()
