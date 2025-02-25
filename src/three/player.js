import {
    Mesh,
    BoxGeometry,
    MeshStandardMaterial,
    MeshNormalMaterial,
    Matrix4
} from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import scene from './scene.js'

 class Player {
    constructor(id, username, position, rotation) {
        this.id = id;
        this.username = username;

        this.mesh = new Mesh(
            new BoxGeometry(1, 2, 1),
            [
                new MeshStandardMaterial({ color: 0xff0000 }), // Right
                new MeshStandardMaterial({ color: 0xff0000 }), // Left
                new MeshStandardMaterial({ color: 0xff0000 }), // Top
                new MeshStandardMaterial({ color: 0xff0000 }), // Bottom
                new MeshStandardMaterial({ color: 0xff0000 }), // Front
                new MeshStandardMaterial({ color: 0xff00ff })  // Back
            ]
        )

        const loader = new FontLoader();
        const font = loader.parse(HelvetikerFont);

        this.nametag = new Mesh(
            new TextGeometry(username ?? '', {
                font: font,
                size: 0.5,
                depth: 0.1,
                curveSegments: 1
            }),
            new MeshNormalMaterial()
        )
        this.nametag.geometry.center();
        this.nametag.scale.set(-1,1,1);

        this.setPosition(position)
        this.setRotation(rotation)

        scene.add(this.mesh)
        scene.add(this.nametag)
    }

    setPosition(position) {
        this.nametag.position.set(position.x, position.y + 1.5, position.z)
        this.mesh.position.set(position.x, position.y, position.z)
    }

    setRotation(rotation) {
        this.mesh.rotation.set(rotation.x, rotation.y, rotation.z)
        this.nametag.rotation.set(rotation.x, rotation.y, rotation.z)
    }

    dispose() {
        scene.remove(this.mesh)
        this.mesh.geometry.dispose()
        this.mesh.material.forEach(material => material.dispose())

        scene.remove(this.nametag)
        this.nametag.geometry.dispose()
        this.nametag.material.dispose()
    }
}

export default Player