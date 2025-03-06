import { Mesh, MeshBasicMaterial, ShapeGeometry } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import GooseGame from '../GooseGame.js'
import Stats from 'three/addons/libs/stats.module.js'

class DebugGui {
    constructor() {
        // Load the font
        const loader = new FontLoader()
        this.font = loader.parse(HelvetikerFont)

        // Create the text
        this.mesh = new Mesh(
            new ShapeGeometry(),
            new MeshBasicMaterial({
                color: 0xffffff,
            })
        )

        this.mesh.renderOrder = 1000

        this.mesh.position.set(0.5, 0.75, -1)

        GooseGame.instance.renderer.sceneManager.camera.add(this.mesh)

        //Stats
        this.stats = new Stats()
        GooseGame.instance.config.CANVAS.parentElement.appendChild(
            this.stats.dom
        )
    }
    objectToText(object) {
        const calculateTime = (time) => {
            const totalSeconds = time / (24000 / 86400) // Convert game time to real-world seconds (24,000 ticks = 86,400s)
            const hours = Math.floor(totalSeconds / 3600) % 24 // Ensure hours wrap around at 24
            const minutes = Math.floor((totalSeconds % 3600) / 60)

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        }

        return `
            XYZ: ${Math.round(object.position.x)} ${Math.round(object.position.y)} ${Math.round(object.position.z)}
            Time: ${calculateTime(object.time)}
            Ticks: ${object.time}
        `
    }
    render() {
        const text = this.objectToText({
            position: GooseGame.instance.renderer.sceneManager.camera.position,
            time: GooseGame.instance.gameManager.world.worldTime,
        })

        this.mesh.geometry = new ShapeGeometry(
            this.font.generateShapes(text, 0.05),
            3
        )

        this.stats.update()
    }
}

export default DebugGui
