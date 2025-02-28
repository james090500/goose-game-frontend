import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

class GameObjects {
    static {
        GameObjects.tree = GameObjects.loadObject('item/tree/tree')
        GameObjects.goose = GameObjects.loadObject('character/goose')
    }

    static async loadObject(path) {
        const mtlLoader = new MTLLoader()
        const objLoader = new OBJLoader()

        // Load MTL file
        const mtl = await new Promise((resolve, reject) => {
            mtlLoader.load(`${path}.mtl`, resolve, undefined, reject)
        })

        mtl.preload()
        objLoader.setMaterials(mtl)

        // Load OBJ file
        return new Promise((resolve, reject) => {
            objLoader.load(`${path}.obj`, resolve, undefined, reject)
        })
    }
}

export default GameObjects
