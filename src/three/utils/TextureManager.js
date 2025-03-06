import { TextureLoader, RepeatWrapping } from 'three'

class TextureManager {
    static {
        //Ground
        let loader = new TextureLoader()
        TextureManager.grass = loader.load('grass.png', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping
        })
        TextureManager.sand = loader.load('sand.png', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping
        })
    }
}

export default TextureManager
