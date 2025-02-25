import {
    Scene,
    AmbientLight,
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    Fog,
    Color,
    HemisphereLight,
    TextureLoader,
    RepeatWrapping,
} from 'three'

const scene = new Scene()
scene.background = new Color(0x99ddff)

//Lights
scene.add(new AmbientLight(0xffffff, 1))
scene.add(new HemisphereLight(0xffffbb, 0x080820, 2))

//Ground
let loader = new TextureLoader()
const texture = loader.load('grass.png', function (texture) {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.offset.set(0, 0)
    texture.repeat.set(10000 / 32, 10000 / 32)
})

const ground = new Mesh(
    new PlaneGeometry(10000, 10000),
    new MeshStandardMaterial({
        map: texture,
    })
)

ground.rotation.x = -Math.PI / 2
scene.add(ground)

//Fog
scene.fog = new Fog(0x99ddff, 10, 100)

export default scene
