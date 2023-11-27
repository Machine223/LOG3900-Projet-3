package ca.polymtl.project.client.tutorial

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View

class TargetView(context: Context, attrs: AttributeSet) : View(context, attrs) {
    private var rect = Rect()
    private val paint = Paint()

    private val offset = 5.0f

    init {
        paint.color = Color.BLACK
        paint.alpha = 100
    }

    fun targetRect(rect: Rect) {
        this.rect = rect
        invalidate()
    }

    override fun onDraw(canvas: Canvas?) {
        canvas?.drawPath(createPath(rect), paint)
    }

    private fun createPath(rect: Rect): Path {
        val p = Path()

        p.moveTo(0.0f, 0.0f)
        p.lineTo(0.0f, height.toFloat())
        p.lineTo(width.toFloat(), height.toFloat())
        p.lineTo(width.toFloat(), 0.0f)

        p.moveTo(rect.left.toFloat() - offset, rect.top.toFloat() - offset)
        p.lineTo(rect.right.toFloat() + offset, rect.top.toFloat() - offset)
        p.lineTo(rect.right.toFloat() + offset, rect.bottom.toFloat() + offset)
        p.lineTo(rect.left.toFloat() - offset, rect.bottom.toFloat() + offset)

        return p
    }

}