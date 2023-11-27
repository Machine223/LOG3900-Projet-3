package ca.polymtl.project.client.draw.tools

import android.graphics.Paint
import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.communications.primitive.NewPartsPrimitive
import ca.polymtl.project.client.draw.element.TargetableDrawingElement
import ca.polymtl.project.client.draw.manager.LocalDrawingManager
import ca.polymtl.project.client.draw.tools.actions.NewPathAction
import java.math.BigInteger

class PencilTool(
    drawingManager: LocalDrawingManager,
    emitter: LocalEmitter,
    private var color: String,
    private var opacity: Float,
    private var strokeWidth: Float
) : Tool(drawingManager, emitter) {
    companion object {
        fun createPaint(color: String, opacity: Float, strokeWidth: Float): Paint {
            val paint = Paint()
            paint.strokeCap = Paint.Cap.ROUND
            paint.strokeJoin = Paint.Join.ROUND
            paint.style = Paint.Style.STROKE

            paint.color = BigInteger("FF" + color.replace(Regex("[^\\da-zA-Z.]"), ""), 16).toInt()
            paint.alpha = (opacity * 255).toInt()
            paint.strokeWidth = strokeWidth

            return paint
        }
    }

    private var currentPath: TargetableDrawingElement? = null
    private var paint: Paint = createPaint(color, opacity, strokeWidth)

    fun getStrokeWidth(): Float {
        return strokeWidth
    }

    fun setColor(color: String) {
        this.color = color
        refreshPaint()
    }

    fun setOpacity(opacity: Float) {
        this.opacity = opacity
        refreshPaint()
    }

    override fun setSizeAttribute(size: Float) {
        this.strokeWidth = size
        refreshPaint()
    }

    override fun onTouch(x: Float, y: Float) {
        currentPath = TargetableDrawingElement(drawingManager.generateId(), paint)

        emitter.emitNewElement(ElementPrimitive.fromDrawingElement(drawingManager.gameRoom, currentPath!!))
        drawingManager.addElement(currentPath!!)

        onMove(x, y)
        onMove(x, y)
    }

    override fun onMove(x: Float, y: Float) {
        if (currentPath != null) {
            currentPath!!.addPoint(x, y)
            emitter.emitNewCoordinates(NewPartsPrimitive.fromDrawingElement(drawingManager.gameRoom, currentPath!!))
        }
    }

    override fun onRelease(x: Float, y: Float) {
        if (currentPath != null) {
            drawingManager.addAction(NewPathAction(currentPath!!))
            currentPath = null
        }
    }

    private fun refreshPaint() {
        paint = createPaint(color, opacity, strokeWidth)
    }
}