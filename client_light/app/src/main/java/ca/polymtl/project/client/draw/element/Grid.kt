package ca.polymtl.project.client.draw.element

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint

class Grid(private var width: Float, opacity: Float) {
    private val paint = Paint()
    private val lines = ArrayList<Line>()
    private var isDirty = true

    init {
        paint.strokeCap = Paint.Cap.ROUND
        paint.strokeJoin = Paint.Join.ROUND
        paint.style = Paint.Style.STROKE

        paint.color = Color.BLACK
        paint.strokeWidth = 1.0f

        setOpacity(opacity)
    }

    fun setWidth(width: Float) {
        this.width = width

        isDirty = true
    }

    fun setOpacity(opacity: Float) {
        paint.alpha = (opacity * 255.0f).toInt()
    }

    fun render(canvas: Canvas) {
        if (isDirty) {
            refreshPath(canvas.width.toFloat(), canvas.height.toFloat())
            isDirty = false
        }

        for (line in lines)
            canvas.drawLine(line.start.first, line.start.second, line.end.first, line.end.second, paint)
    }

    private fun refreshPath(canvasW: Float, canvasH: Float) {
        lines.clear()
        val nX = (canvasW - (canvasW % width)).toInt()
        val nY = (canvasH - (canvasH % width)).toInt()

        lines.ensureCapacity((nX - 1) * (nY - 1))

        for (i in 1 until nX) {
            val x = width * i
            lines.add(Line(Pair(x, 0.0f), Pair(x, canvasH)))
        }

        for (i in 1 until nY) {
            val y = width * i
            lines.add(Line(Pair(0.0f, y), Pair(canvasW, y)))
        }
    }

    private class Line(val start: Pair<Float, Float>, val end: Pair<Float, Float>)
}