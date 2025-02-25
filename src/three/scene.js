import { Scene, AmbientLight } from 'three'

const scene = new Scene()
scene.add(new AmbientLight(0xffffff, 1))

export default scene
