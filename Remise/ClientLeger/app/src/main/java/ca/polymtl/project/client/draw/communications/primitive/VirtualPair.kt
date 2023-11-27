package ca.polymtl.project.client.draw.communications.primitive

class VirtualPair {
    class Drawing {
        val background: String = ""
        val backgroundOpacity: Float = 0.0F
        val elements: Array<ElementPrimitive> = emptyArray()
        val coordinates: Array<NewPartsPrimitive> = emptyArray()
    }

    var word: String = ""
    val hints: Array<String> = emptyArray()
    val difficulty: Int = 0
    val delay: Int = 0

    val isRandom: Boolean = false
    val drawing: Drawing = Drawing()
}