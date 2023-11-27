package ca.polymtl.project.client.draw.tools

import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.manager.LocalDrawingManager

abstract class Tool(protected val drawingManager: LocalDrawingManager, protected val emitter: LocalEmitter) {
    abstract fun onTouch(x: Float, y: Float)
    abstract fun onMove(x: Float, y: Float)
    abstract fun onRelease(x: Float, y: Float)

    abstract fun setSizeAttribute(size: Float)
}