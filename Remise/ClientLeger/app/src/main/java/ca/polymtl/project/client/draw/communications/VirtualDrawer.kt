package ca.polymtl.project.client.draw.communications

import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.communications.primitive.NewPartsPrimitive
import ca.polymtl.project.client.draw.communications.primitive.VirtualPair
import ca.polymtl.project.client.game.primitive.GameRoom
import java.util.*
import java.util.function.Consumer


class VirtualDrawer(private val gameRoom: GameRoom) : RemoteSupplier {
    private lateinit var pair: VirtualPair
    private var currentPartIndex = 0
    private var currentCoordinateIndex = 0

    private var onNewElementListener: Consumer<ElementPrimitive> = Consumer { }
    private var onNewCoordinatesListener: Consumer<NewPartsPrimitive> = Consumer { }
    private var onEditBackgroundListener: Consumer<BackgroundPrimitive> = Consumer { }

    private var timer = Timer()

    fun setPair(pair: VirtualPair) {
        this.pair = pair
    }

    override fun start() {
        stop()

        timer = Timer()

        currentPartIndex = 0
        currentCoordinateIndex = 0

        val drawing = pair.drawing
        onEditBackgroundListener.accept(
            BackgroundPrimitive(
                gameRoom.gameroomName,
                drawing.background,
                drawing.backgroundOpacity
            )
        )
        drawing.elements.forEach { element -> onNewElementListener.accept(element) }

        try {
            timer.scheduleAtFixedRate(object : TimerTask() {
                override fun run() {
                    drawNext(drawing.coordinates)
                }

            }, 0, pair.delay.toLong())
        } catch (e: Exception) {
            // RIP
        }
    }

    private fun drawNext(parts: Array<NewPartsPrimitive>) {
        val currentPart = parts[currentPartIndex]
        val coordinate = currentPart.parts[currentCoordinateIndex++]

        if (currentCoordinateIndex >= currentPart.parts.size) {
            currentPartIndex++
            currentCoordinateIndex = 0
        }

        if (currentPartIndex >= parts.size) {
            timer.cancel()
        }

        onNewCoordinatesListener.accept(
            NewPartsPrimitive(
                gameRoom.gameroomName,
                currentPart.id,
                arrayOf(coordinate)
            )
        )
    }

    override fun stop() {
        timer.cancel()
        timer.purge()
    }

    override fun setOnNewElementListener(listener: Consumer<ElementPrimitive>) {
        this.onNewElementListener = listener
    }

    override fun setOnNewCoordinatesListener(listener: Consumer<NewPartsPrimitive>) {
        this.onNewCoordinatesListener = listener
    }

    override fun setOnEditBackgroundListener(listener: Consumer<BackgroundPrimitive>) {
        this.onEditBackgroundListener = listener
    }

    override fun setOnDeleteElementListener(listener: Consumer<ElementPrimitive>) {}

    override fun setOnUndeleteElementListener(listener: Consumer<ElementPrimitive>) {}
}