package ca.polymtl.project.client.draw.manager

import ca.polymtl.project.client.draw.communications.RemoteSupplier
import ca.polymtl.project.client.draw.element.DrawingElement
import ca.polymtl.project.client.game.primitive.GameRoom
import java.util.function.Consumer

class RemoteDrawingManager(gameRoom: GameRoom, private val primitiveSupplier: RemoteSupplier, private val invalidateRunnable: Runnable) : DrawingManager<DrawingElement>(gameRoom) {
    private val elementMap = HashMap<Int, DrawingElement>()

    init {
        primitiveSupplier.setOnNewElementListener(
            Consumer { elementPrimitive ->
                addElement(elementPrimitive.createDrawingElement())
                invalidateRunnable.run()
            }
        )

        primitiveSupplier.setOnNewCoordinatesListener(
            Consumer { partsPrimitive ->
                val element = elementMap[partsPrimitive.id]
                if (element != null) {
                    partsPrimitive.applyOnDrawingElement(element)
                    invalidateRunnable.run()
                }
            }
        )

        primitiveSupplier.setOnDeleteElementListener(
            Consumer { elementPrimitive ->
                val element = elementMap[elementPrimitive.id]
                if (element != null)
                    element.hide()
                invalidateRunnable.run()
            }
        )

        primitiveSupplier.setOnUndeleteElementListener(
            Consumer { elementPrimitive ->
                val element = elementMap[elementPrimitive.id]
                if (element != null)
                    element.unhide()
                invalidateRunnable.run()
            }
        )

        primitiveSupplier.setOnEditBackgroundListener(
            Consumer { backgroundPrimitive ->
                backgroundPrimitive.applyOn(this)
                invalidateRunnable.run()
            }
        )
    }

    override fun addElement(element: DrawingElement) {
        super.addElement(element)
        elementMap[element.id] = element
    }

    fun startDrawing() {
        primitiveSupplier.start()
    }

    fun endDrawing() {
        primitiveSupplier.stop()
    }
}