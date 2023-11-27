package ca.polymtl.project.client.draw.tools.actions

import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.element.TargetableDrawingElement
import ca.polymtl.project.client.draw.manager.LocalDrawingManager

class DeletePathAction(private val path: TargetableDrawingElement) : Action {
    override fun redo(drawingManager: LocalDrawingManager, emitter: LocalEmitter) {
        emitter.emitDeleteElement(ElementPrimitive.fromDrawingElement(drawingManager.gameRoom, path))
        path.hide()
    }

    override fun undo(drawingManager: LocalDrawingManager, emitter: LocalEmitter) {
        emitter.emitUndeleteElement(ElementPrimitive.fromDrawingElement(drawingManager.gameRoom, path))
        path.unhide()
    }
}