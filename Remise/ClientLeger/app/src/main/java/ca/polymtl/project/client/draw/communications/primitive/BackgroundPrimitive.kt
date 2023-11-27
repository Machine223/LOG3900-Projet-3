package ca.polymtl.project.client.draw.communications.primitive

import ca.polymtl.project.client.draw.element.DrawingElement
import ca.polymtl.project.client.draw.manager.DrawingManager

class BackgroundPrimitive(val gameroomName: String, val color: String, val opacity: Float) {
    fun <T : DrawingElement> applyOn(drawingManager: DrawingManager<T>) {
        drawingManager.setBackground(color)
        drawingManager.setOpacity(opacity)
    }
}