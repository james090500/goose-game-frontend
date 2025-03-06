import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { MeshLambertMaterial } from 'three'

class GameObjects {
    static {
        GameObjects.tree = GameObjects.loadObjectWithMaterial(
            'item/tree/tree',
            {
                'Material.001': new MeshLambertMaterial({ color: 0x00ff00 }),
                'Material.002': new MeshLambertMaterial({ color: 0xa52a2a }),
            }
        )
        GameObjects.goose = GameObjects.loadObjectAndMTL('character/goose')
    }

    static async loadObjectAndMTL(path) {
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

    /**
     * Load an obj from path with manual materials
     * @param {*} path
     * @param {*} material
     * @returns
     */
    static async loadObjectWithMaterial(path, materials) {
        const objLoader = new OBJLoader()

        // Load OBJ file
        return new Promise((resolve, reject) => {
            objLoader.load(
                `${path}.obj`,
                (root) => {
                    root.traverse((node) => {
                        const material = materials[node.material?.name]
                        if (material) {
                            node.material = material
                        }
                    })
                    resolve(root)
                },
                undefined,
                reject
            )
        })
    }
}

export default GameObjects
