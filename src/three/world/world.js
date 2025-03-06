import { Color, MathUtils } from 'three'
import WorldRenderer from '../renderer/world/WorldRenderer.js'
import TreeEntity from '../entity/world/TreeEntity.js'
import GooseGame from '../GooseGame.js'

class World {
    seaHeight = 1
    maxHeight = 0
    worldSize = 1024
    worldTime = 6000

    constructor() {
        this.worldRenderer = new WorldRenderer(this)
    }

    createTrees(trees) {
        for (let i = 0; i < trees.length; i += 3) {
            const x = trees[i]
            const y = trees[i + 1]
            const z = trees[i + 2]

            new TreeEntity(x, y, z)
        }
    }
    updateTime() {
        this.worldTime++

        // Reset if after midnight to 1 as 24000 == 0
        if (this.worldTime > 24000) {
            this.worldTime = 1
        }

        //Get the light value of the world
        const worldLight = this.getWorldLight(this.worldTime)
        this.worldRenderer.sun.intensity = worldLight

        // Get the colour of the sky and adjust lighting
        const skyColor = new Color(this.getSkyColor(this.worldTime))
        GooseGame.instance.renderer.sceneManager.scene.background = skyColor
        GooseGame.instance.renderer.sceneManager.scene.fog.color = skyColor
        this.worldRenderer.ambientLight.skyColor = skyColor
        this.worldRenderer.ambientLight.groundColor = skyColor
    }
    getWorldLight(tick) {
        let transition

        // Midnight to Daylight
        if (tick >= 6000 && tick < 7000) {
            transition = (tick - 6000) / 1000 // Normalize between 6000-7000
            return MathUtils.lerp(0, 2, transition)
        }
        // Daylight (Static 2.0)
        else if (tick >= 7000 && tick < 18000) {
            return 2
        }
        // Daylight to Midnight
        else if (tick >= 18000 && tick < 19000) {
            transition = (tick - 18000) / 1000 // Normalize between 18000-18500
            return MathUtils.lerp(2, 0, transition)
        }
        // Night (Static 0.0)
        else {
            return 0
        }
    }
    getSkyColor(tick) {
        const midnight = [8, 8, 32]
        const orange = [254, 135, 20]
        const blue = [153, 221, 255]

        const rgbToHex = (rgb) => {
            return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]
        }

        const lerpRgbToHex = (start, end, tick, tickStart) => {
            let t = (tick - tickStart) / 500

            const r = MathUtils.lerp(start[0], end[0], t)
            const g = MathUtils.lerp(start[1], end[1], t)
            const b = MathUtils.lerp(start[2], end[2], t)

            return rgbToHex([Math.round(r), Math.round(g), Math.round(b)])
        }

        //Dawn
        if (tick >= 6000 && tick < 6500) {
            return lerpRgbToHex(midnight, orange, tick, 6000)
        } else if (tick >= 6500 && tick < 7000) {
            return lerpRgbToHex(orange, blue, tick, 6500)
            //Daylight
        } else if (tick >= 7000 && tick < 18000) {
            return rgbToHex(blue)
            //Evening
        } else if (tick >= 18000 && tick < 18500) {
            return lerpRgbToHex(blue, orange, tick, 18000)
        } else if (tick >= 18500 && tick < 19000) {
            return lerpRgbToHex(orange, midnight, tick, 18500)
            //Night
        } else {
            return rgbToHex(midnight)
        }
    }
    tick() {
        this.updateTime()
    }
}

export default World
