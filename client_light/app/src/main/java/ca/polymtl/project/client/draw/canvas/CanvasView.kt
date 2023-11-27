package ca.polymtl.project.client.draw.canvas

import android.content.Context
import android.graphics.Canvas
import android.util.AttributeSet
import android.view.View
import java.util.function.Consumer

class CanvasView(context: Context, attrs: AttributeSet) : View(context, attrs) {
    private var onDrawHandler = Consumer<Canvas> {}

    fun setOnDrawHandler(consumer: Consumer<Canvas>) {
        onDrawHandler = consumer
    }

    override fun onDraw(canvas: Canvas?) {
        if (canvas != null) {
            onDrawHandler.accept(canvas)
        }
    }
}
