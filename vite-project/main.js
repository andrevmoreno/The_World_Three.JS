import * as THREE from 'three'
import './style.css'
import './images/sun.jpg'
import './images/2k_moon.jpg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'

const scene = new THREE.Scene()

//Texture
const textureLoader = new THREE.TextureLoader()
const sunTexture = textureLoader.load('./images/sun.jpg')
const aoTexture = textureLoader.load('./images/2k_moon.jpg')

//Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  map: sunTexture,
  aoMap: aoTexture,
  roughness: 0.2,
})
material.aoMapIntensity = 2
sunTexture.wrapS = THREE.RepeatWrapping
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Sizes
const sizes = {
  widht: window.innerWidth,
  height: window.innerHeight,
}

//Camera
const camera = new THREE.PerspectiveCamera(
  30,
  sizes.widht / sizes.height,
  0.1,
  100
)
camera.position.z = 20
scene.add(camera)

//Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2, 100)
directionalLight.position.set(0, 10, 10)
scene.add(directionalLight)

// const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
// scene.add(ambientLight)

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.widht, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener('resize', () => {
  console.log('resize')
  sizes.widht = window.innerWidth
  sizes.height = window.innerHeight
  //update camera
  camera.updateProjectionMatrix()
  camera.aspect = sizes.widht / sizes.height
  renderer.setSize(sizes.widht, sizes.height)
})

//Loop
const loop = () => {
  // mesh.rotation.z += 1
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo('nav', { y: '100%' }, { y: '0%' })
tl.fromTo('tittle', { opacity: 0 }, { opacity: 1 })

//Mouse Animation Color
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Match.round((e.pageX / sizes.width) * 255),
      Match.round((e.pageY / sizes.height) * 255),
      150,
    ]
    //Let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
    gsap.to(material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})
