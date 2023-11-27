package ca.polymtl.project.client.draw.element

import android.graphics.Paint
import java.util.*
import kotlin.collections.ArrayList
import kotlin.math.pow

class TargetableDrawingElement(
    id: Int,
    paint: Paint
) : DrawingElement(id, paint) {
    private val points = Stack<Pair<Float, Float>>()
    private val freshPoints = ArrayList<Pair<Float, Float>>()

    fun addPoint(x: Float, y: Float) {
        points.addElement(Pair(x, y))
        freshPoints.add(Pair(x, y))
        if (path.isEmpty) path.moveTo(x, y) else path.lineTo(x, y)
    }

    fun isInCircle(x: Float, y: Float, r: Float): Boolean {
        val realR = (r + paint.strokeWidth / 2.0).toFloat()
        for (i in 0 until points.size - 1) {
            if (isLineInCircle(x, y, realR, points[i], points[i + 1])) {
                return true
            }
        }

        if (!points.empty()) {
            return isPointInCircle(x, y, realR, points.last())
        }

        return false
    }

    fun readFreshParts(): Array<String> {
        val freshParts = ArrayList<String>()
        if (freshPoints.isEmpty())
            return freshParts.toArray(emptyArray<String>())

        freshParts.ensureCapacity(freshPoints.size)

        val firstLetter = if (points.size == freshPoints.size) "M" else "L"
        freshParts.add("$firstLetter${freshPoints[0].first} ${freshPoints[0].second} ")
        for (point in freshPoints.subList(1, freshPoints.size))
            freshParts.add("L${point.first} ${point.second} ")

        freshPoints.clear()

        return freshParts.toArray(emptyArray<String>())
    }

    private fun isLineInCircle(x: Float, y: Float, r: Float, p0: Pair<Float, Float>, p1: Pair<Float, Float>): Boolean {
        val x0 = p0.first - x
        val y0 = p0.second - y

        val u = p1.first - p0.first
        val v = p1.second - p0.second

        val a = u.pow(2) + v.pow(2)
        val b = 2.0 * (u * x0 + v * y0)
        val c = x0.pow(2) + y0.pow(2) - r.pow(2)

        val inSqrt = b.pow(2) - 4.0 * a * c
        if (inSqrt < 0)
            return false

        val sqrt = inSqrt.pow(0.5)

        val zeros = arrayOf((-b - sqrt) / (2 * a), (-b + sqrt) / (2 * a))
        zeros.forEach { z -> if (z in 0.0..1.0) return true }
        return false
    }

    private fun isPointInCircle(x: Float, y: Float, r: Float, point: Pair<Float, Float>): Boolean {
        return ((x - point.first).pow(2) + (y - point.second).pow(2)) <= r.pow(2)
    }
}