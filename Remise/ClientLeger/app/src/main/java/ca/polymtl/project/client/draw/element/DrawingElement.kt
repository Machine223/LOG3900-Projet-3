package ca.polymtl.project.client.draw.element

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Path
import java.util.stream.Collectors

open class DrawingElement(
    val id: Int,
    protected val paint: Paint
) {
    protected val path: Path = Path()
    var hidden = false

    init {
        paint.isAntiAlias = true
    }

    fun getColor(): String {
        return "#" + Integer.toHexString(paint.color).substring(2)
    }

    fun getOpacity(): Float {
        return (paint.alpha.toFloat()) / 255.0f
    }

    fun getStrokeWidth(): Float {
        return paint.strokeWidth
    }

    fun addSegment(segment: String) {
        val letter = segment[0].toLowerCase()
        val numbers = segment.substring(1).split(" ")
            .stream()
            .filter { s -> s.isNotEmpty() }
            .map { s -> s.toFloat() }
            .collect(Collectors.toList())
        when (letter) {
            'm' -> path.moveTo(numbers[0], numbers[1])
            'l' -> path.lineTo(numbers[0], numbers[1])
            else -> throw Exception("Not handled, don't use paths.")
        }
    }

    fun addSegments(segments: Array<String>) {
        segments.forEach { s -> addSegment(s) }
    }

    fun hide() {
        hidden = true
    }

    fun unhide() {
        hidden = false
    }

    fun render(canvas: Canvas) {
        canvas.drawPath(path, paint)
    }
}