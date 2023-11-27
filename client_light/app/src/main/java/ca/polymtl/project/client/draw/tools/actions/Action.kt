package ca.polymtl.project.client.draw.tools.actions

import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.manager.LocalDrawingManager

interface Action {
    fun redo(drawingManager: LocalDrawingManager, emitter: LocalEmitter)
    fun undo(drawingManager: LocalDrawingManager, emitter: LocalEmitter)
}