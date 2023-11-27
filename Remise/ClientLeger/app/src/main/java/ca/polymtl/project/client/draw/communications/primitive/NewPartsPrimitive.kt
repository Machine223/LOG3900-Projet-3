package ca.polymtl.project.client.draw.communications.primitive

import ca.polymtl.project.client.draw.element.DrawingElement
import ca.polymtl.project.client.draw.element.TargetableDrawingElement
import ca.polymtl.project.client.game.primitive.GameRoom

class NewPartsPrimitive(val gameroomName: String, val id: Int, val parts: Array<String>) {
    fun applyOnDrawingElement(element: DrawingElement) {
        element.addSegments(parts)
    }

    companion object {
        fun fromDrawingElement(gameRoom: GameRoom, drawingElement: TargetableDrawingElement): NewPartsPrimitive {
            return NewPartsPrimitive(gameRoom.gameroomName, drawingElement.id, drawingElement.readFreshParts())
        }
    }
}