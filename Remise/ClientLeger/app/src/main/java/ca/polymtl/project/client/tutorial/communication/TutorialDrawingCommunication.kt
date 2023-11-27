package ca.polymtl.project.client.tutorial.communication

import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.draw.communications.VirtualDrawer
import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.communications.primitive.NewPartsPrimitive
import ca.polymtl.project.client.game.primitive.GameRoom
import com.github.nkzawa.socketio.client.IO
import java.util.function.Consumer

class TutorialDrawingCommunication : DrawingCommunication(IO.socket("http://localhost/")) {
    private var virtualDrawer: VirtualDrawer? = null

    var nDrawnObjects = 0

    fun attachToRoom(gameRoom: GameRoom) {
        nDrawnObjects = 0
        virtualDrawer = VirtualDrawer(gameRoom)
    }

    override fun start() {
        virtualDrawer?.start()
    }

    override fun stop() {
        virtualDrawer?.stop()
    }

    /*------------------------------------------------------------------------------------------------------------------------*/

    override fun setOnNewElementListener(listener: Consumer<ElementPrimitive>) {
        virtualDrawer?.setOnNewElementListener(listener)
    }

    override fun setOnNewCoordinatesListener(listener: Consumer<NewPartsPrimitive>) {
        virtualDrawer?.setOnNewCoordinatesListener(listener)
    }

    override fun setOnEditBackgroundListener(listener: Consumer<BackgroundPrimitive>) {
        virtualDrawer?.setOnEditBackgroundListener(listener)
    }

    override fun setOnDeleteElementListener(listener: Consumer<ElementPrimitive>) {
        virtualDrawer?.setOnDeleteElementListener(listener)
    }

    override fun setOnUndeleteElementListener(listener: Consumer<ElementPrimitive>) {
        virtualDrawer?.setOnUndeleteElementListener(listener)
    }

    /*------------------------------------------------------------------------------------------------------------------------*/

    override fun emitNewElement(elementPrimitive: ElementPrimitive) {
        nDrawnObjects++
    }
}