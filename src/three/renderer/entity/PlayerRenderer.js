import {
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    ShapeGeometry,
    Group,
} from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import GooseGame from '../../GooseGame.js'
import GameObjects from '../../utils/GameObjects.js'

class PlayerRenderer {
    constructor(username) {
        this.mesh = new Group()

        // Load character
        GameObjects.goose.then((goose) => {
            let characterMesh = goose.clone()
            characterMesh.scale.set(1.75, 1.75, -1.75)
            characterMesh.name = 'goose'
            this.mesh.add(characterMesh)
        })

        // Create nametag group
        this.nametag = new Group()
        this.nametag.name = 'nametag'

        // Load the font
        const loader = new FontLoader()
        const font = loader.parse(HelvetikerFont)

        // Create the text
        const textMesh = new Mesh(
            new ShapeGeometry(font.generateShapes(username ?? '', 0.4), 3),
            new MeshBasicMaterial({ color: 0xffffff })
        )
        textMesh.geometry.center()
        this.nametag.add(textMesh)

        // Create the background with text as size
        const backgroundMesh = new Mesh(
            new PlaneGeometry(
                0.15 +
                    textMesh.geometry.boundingBox.max.x -
                    textMesh.geometry.boundingBox.min.x,
                0.15 +
                    textMesh.geometry.boundingBox.max.y -
                    textMesh.geometry.boundingBox.min.y
            ),
            new MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.5,
                depthWrite: false,
            })
        )
        backgroundMesh.position.set(0, 0, -0.01)
        this.nametag.add(backgroundMesh)

        // Move nametag to position
        this.nametag.position.set(0, 2.75, 0)

        // Add to mesh
        this.mesh.add(this.nametag)

        // Add to scene
        GooseGame.instance.renderer.sceneManager.add(this.mesh)
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z)
        this.updateNametag()
    }

    setRotation(x, y, z) {
        this.mesh.rotation.set(x, y, z)
        this.updateNametag()
    }

    updateNametag() {
        this.nametag.lookAt(
            GooseGame.instance.renderer.sceneManager.camera.position
        )
    }
}

export default PlayerRenderer
