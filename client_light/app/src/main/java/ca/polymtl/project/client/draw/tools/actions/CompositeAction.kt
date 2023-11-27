package ca.polymtl.project.client.draw.tools.actions

import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.manager.LocalDrawingManager
import java.util.*

class CompositeAction : Action {
    private val children = Stack<Action>()

    fun addChild(child: Action) {
        children.push(child)
    }

    override fun redo(drawingManager: LocalDrawingManager, emitter: LocalEmitter) {
        for (child in children)
            child.redo(drawingManager, emitter)
    }

    override fun undo(drawingManager: LocalDrawingManager, emitter: LocalEmitter) {
        for (child in children)
            child.undo(drawingManager, emitter)
    }
}