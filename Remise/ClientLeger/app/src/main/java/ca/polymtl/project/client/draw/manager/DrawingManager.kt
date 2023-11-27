package ca.polymtl.project.client.draw.manager

import android.graphics.Canvas
import android.graphics.PorterDuff
import ca.polymtl.project.client.draw.ColorData
import ca.polymtl.project.client.draw.element.DrawingElement
import ca.polymtl.project.client.draw.tools.PencilTool
import ca.polymtl.project.client.game.primitive.GameRoom
import java.util.*

abstract class DrawingManager<T : DrawingElement>(val gameRoom: GameRoom) {
    private var backgroundColor: String = ColorData(0xFFFFFF, 1.0f).colorAsString() // default is white
    var colorDataBackground: ColorData = ColorData(0xFFFFFF, 1.0f)
    private var opacity: Float = 1.0f
    protected val elements: Stack<T> = Stack()

    fun setBackground(color: String) {
        this.backgroundColor = color
    }

    fun setOpacity(opacity: Float) {
        this.opacity = opacity
    }

    fun getOpacity(): Float{
        return this.opacity
    }

    fun getBackground(): String {
        return backgroundColor
    }

    fun clearElements() {
        elements.clear()
    }

    open fun addElement(element: T) {
        elements.push(element)
    }

    open fun renderToCanvas(canvas: Canvas) {
        val paint = PencilTool.createPaint(backgroundColor, opacity, 0.0f)
        canvas.drawColor(paint.color, PorterDuff.Mode.SRC_OVER)
        val currentElements = elements.toList()
        for (e in currentElements)
            if (!e.hidden)
                e.render(canvas)
    }
}