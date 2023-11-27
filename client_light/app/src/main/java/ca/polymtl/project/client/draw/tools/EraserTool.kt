package ca.polymtl.project.client.draw.tools

import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.element.TargetableDrawingElement
import ca.polymtl.project.client.draw.manager.LocalDrawingManager
import ca.polymtl.project.client.draw.tools.actions.CompositeAction
import ca.polymtl.project.client.draw.tools.actions.DeletePathAction
import java.util.*

class EraserTool(drawingManager: LocalDrawingManager, emitter: LocalEmitter, private var radius: Float) : Tool(drawingManager, emitter) {
    private val deletedPaths = Stack<TargetableDrawingElement>()

    override fun onTouch(x: Float, y: Float) {
        val element = drawingManager.findElement(x, y, radius)
        if (element != null) {
            emitter.emitDeleteElement(ElementPrimitive.fromDrawingElement(drawingManager.gameRoom, element))
            element.hide()

            deletedPaths.add(element)
        }
    }

    fun getRadius(): Float {
        return radius
    }

    override fun onMove(x: Float, y: Float) {
        onTouch(x, y)
    }

    override fun onRelease(x: Float, y: Float) {
        if (deletedPaths.empty())
            return

        val action = CompositeAction()
        for (path in deletedPaths) {
            action.addChild(DeletePathAction(path))
        }

        drawingManager.addAction(action)
        deletedPaths.clear()
    }

    override fun setSizeAttribute(size: Float) {
        radius = size
    }
}