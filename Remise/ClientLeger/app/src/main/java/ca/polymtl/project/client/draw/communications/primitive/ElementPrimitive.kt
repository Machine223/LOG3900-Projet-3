package ca.polymtl.project.client.draw.communications.primitive

import ca.polymtl.project.client.draw.element.DrawingElement
import ca.polymtl.project.client.draw.tools.PencilTool
import ca.polymtl.project.client.game.primitive.GameRoom

class ElementPrimitive(val gameroomName: String, val id: Int, private val color: String, private val opacity: Float, private val strokeWidth: Float) {
    fun createDrawingElement(): DrawingElement {
        val paint = PencilTool.createPaint(color, opacity, strokeWidth)
        return DrawingElement(id, paint)
    }

    companion object {
        fun fromDrawingElement(gameRoom: GameRoom, drawingElement: DrawingElement): ElementPrimitive {
            return ElementPrimitive(gameRoom.gameroomName, drawingElement.id, drawingElement.getColor(), drawingElement.getOpacity(), drawingElement.getStrokeWidth())
        }
    }
}