import { TextureLoader, RepeatWrapping } from 'three'

class Textures {
    static {
        //Ground
        let loader = new TextureLoader()
        Textures.grass = loader.load('grass.png', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping
        })
        Textures.sand = loader.load('sand.png', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping
        })
    }
}

export default Textures
