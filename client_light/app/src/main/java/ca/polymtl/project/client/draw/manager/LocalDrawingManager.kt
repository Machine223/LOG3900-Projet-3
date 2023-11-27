package ca.polymtl.project.client.draw.manager

import android.graphics.Canvas
import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.element.Grid
import ca.polymtl.project.client.draw.element.TargetableDrawingElement
import ca.polymtl.project.client.draw.tools.actions.Action
import ca.polymtl.project.client.game.primitive.GameRoom
import java.util.*

class LocalDrawingManager(gameRoom: GameRoom, private val emitter: LocalEmitter) :
    DrawingManager<TargetableDrawingElement>(gameRoom) {
    private val undoStack = Stack<Action>()
    lateinit var undoState: ButtonState
    private val redoStack = Stack<Action>()
    lateinit var redoState: ButtonState

    private var isGrid = false
    private val grid = Grid(30.0f, 1.0f)

    private var nextId = 1

    fun toggleGrid() {
        isGrid = !isGrid
    }

    fun setGridWidth(width: Float) {
        grid.setWidth(width)
    }

    fun setGridOpacity(opacity: Float) {
        grid.setOpacity(opacity)
    }

    fun generateId(): Int {
        return nextId++
    }

    fun undo() {
        if (undoStack.empty()) {
            return
        }

        val action = undoStack.pop()
        if (undoStack.isEmpty()) {
            undoState.disable()
        }
        action.undo(this, emitter)

        redoStack.push(action)
        redoState.enable()
    }

    fun redo() {
        if (redoStack.empty()) {
            return
        }

        val action = redoStack.pop()
        if (redoStack.isEmpty()) {
            redoState.disable()
        }
        action.redo(this, emitter)

        undoStack.push(action)
        undoState.enable()
    }

    fun findElement(x: Float, y: Float, r: Float): TargetableDrawingElement? {
        for (e in elements.reversed()) {
            if (!e.hidden && e.isInCircle(x, y, r))
                return e
        }

        return null
    }

    fun addAction(action: Action) {
        undoStack.push(action)
        undoState.enable()
        redoStack.clear()
        redoState.disable()
    }

    override fun renderToCanvas(canvas: Canvas) {
        super.renderToCanvas(canvas)
        if (isGrid)
            grid.render(canvas)
    }

    interface ButtonState {
        fun enable()
        fun disable()
    }
}