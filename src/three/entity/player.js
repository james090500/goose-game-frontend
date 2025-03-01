import { Mesh, MeshNormalMaterial } from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import GooseGame from '..'
import GameObjects from '../utils/gameobjects'

class Player {
    constructor(id, username, position, rotation) {
        this.id = id
        this.username = username

        // Load character
        GameObjects.goose.then((goose) => {
            this.character = goose.clone()
            this.character.scale.set(1.75, 1.75, -1.75)
            GooseGame.instance.scene.add(this.character)
        })

        const loader = new FontLoader()
        const font = loader.parse(HelvetikerFont)

        this.nametag = new Mesh(
            new TextGeometry(username ?? '', {
                font: font,
                size: 0.5,
                depth: 0.1,
                curveSegments: 1,
            }),
            new MeshNormalMaterial()
        )
        this.nametag.geometry.center()
        this.nametag.scale.set(-1, 1, 1)

        this.setPosition(position)
        this.setRotation(rotation)

        GooseGame.instance.scene.add(this.nametag)
    }

    setPosition(position) {
        this.nametag.position.set(position.x, position.y + 0.5, position.z)
        if (this.character) {
            this.character.position.set(position.x, position.y - 2, position.z)
        }
    }

    setRotation(rotation) {
        if (this.character) {
            this.character.rotation.set(rotation.x, rotation.y, rotation.z)
        }
        this.nametag.rotation.set(rotation.x, rotation.y, rotation.z)
    }

    dispose() {
        GooseGame.instance.scene.remove(this.character)
        // this.mesh.geometry.dispose()

        GooseGame.instance.scene.remove(this.nametag)
        this.nametag.geometry.dispose()
        this.nametag.material.dispose()
    }
}

export default Player
