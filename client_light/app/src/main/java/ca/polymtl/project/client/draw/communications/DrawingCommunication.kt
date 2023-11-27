package ca.polymtl.project.client.draw.communications

import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.communications.primitive.NewPartsPrimitive
import ca.polymtl.project.client.network.SocketEventHandler
import ca.polymtl.project.client.tutorial.TutorialManager
import ca.polymtl.project.client.tutorial.communication.TutorialDrawingCommunication
import com.github.nkzawa.socketio.client.Socket
import java.util.function.Consumer

open class DrawingCommunication protected constructor(socket: Socket) : RemoteSupplier, LocalEmitter {
    companion object {
        private var socket: Socket? = null
        private var tutorialInstance = TutorialDrawingCommunication()

        fun getInstance(): DrawingCommunication {
            if (TutorialManager.isTutorialMode())
                return tutorialInstance

            return DrawingCommunication(socket!!)
        }

        fun newInstance(socket: Socket) {
            this.socket = socket
        }

        fun newTutorialInstance() {
            tutorialInstance = TutorialDrawingCommunication()
        }
    }

    private val newElementEventHandler = SocketEventHandler<ElementPrimitive>(socket, "draw_new_element")
    private val newCoordsEventHandler = SocketEventHandler<NewPartsPrimitive>(socket, "draw_new_coords")

    private val deleteElementEventHandler = SocketEventHandler<ElementPrimitive>(socket, "draw_delete_element")
    private val undeleteElementEventHandler = SocketEventHandler<ElementPrimitive>(socket, "draw_undelete_element")

    private val editBackgroundEventHandler = SocketEventHandler<BackgroundPrimitive>(socket, "draw_edit_background")

    override fun start() {
    }

    override fun stop() {
        newElementEventHandler.clearListeners()
        newCoordsEventHandler.clearListeners()
        deleteElementEventHandler.clearListeners()
        undeleteElementEventHandler.clearListeners()
        editBackgroundEventHandler.clearListeners()
    }

    /*------------------------------------------------------------------------------------------------------------------------*/

    override fun setOnNewElementListener(listener: Consumer<ElementPrimitive>) {
        newElementEventHandler.addListener(listener)
    }

    override fun setOnNewCoordinatesListener(listener: Consumer<NewPartsPrimitive>) {
        newCoordsEventHandler.addListener(listener)
    }

    override fun setOnEditBackgroundListener(listener: Consumer<BackgroundPrimitive>) {
        editBackgroundEventHandler.addListener(listener)
    }

    override fun setOnDeleteElementListener(listener: Consumer<ElementPrimitive>) {
        deleteElementEventHandler.addListener(listener)
    }

    override fun setOnUndeleteElementListener(listener: Consumer<ElementPrimitive>) {
        undeleteElementEventHandler.addListener(listener)
    }

    /*------------------------------------------------------------------------------------------------------------------------*/

    override fun emitNewElement(elementPrimitive: ElementPrimitive) {
        newElementEventHandler.emit(elementPrimitive)
    }

    override fun emitNewCoordinates(newPartsPrimitive: NewPartsPrimitive) {
        newCoordsEventHandler.emit(newPartsPrimitive)
    }

    override fun emitDeleteElement(elementPrimitive: ElementPrimitive) {
        deleteElementEventHandler.emit(elementPrimitive)
    }

    override fun emitUndeleteElement(elementPrimitive: ElementPrimitive) {
        undeleteElementEventHandler.emit(elementPrimitive)
    }

    override fun emitEditBackground(backgroundPrimitive: BackgroundPrimitive) {
        editBackgroundEventHandler.emit(backgroundPrimitive)
    }
}