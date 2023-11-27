package ca.polymtl.project.client.tutorial

import android.content.Context
import android.graphics.Canvas
import android.util.AttributeSet
import android.util.Log
import androidx.cardview.widget.CardView

class LabelContainer(context: Context, attrs: AttributeSet?) : CardView(context, attrs) {
    private var wasDrawCalled = false

    fun waitForDraw() {
        wasDrawCalled = false
        while (!wasDrawCalled)
            Thread.sleep(10)
    }

    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        wasDrawCalled = true
    }
}
