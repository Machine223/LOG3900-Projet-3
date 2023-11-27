package ca.polymtl.project.client.tutorial

import android.content.Context
import android.graphics.Rect
import android.util.AttributeSet
import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.widget.Button
import android.widget.FrameLayout
import kotlinx.android.synthetic.main.activity_main.view.*

class TutorialLayerView(context: Context, attrs: AttributeSet?) : FrameLayout(context, attrs) {

    private var touchRect: Rect? = null
    private var isInfo = false

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        if (!isInfo && (event != null && touchRect != null)) {

            if (event.x >= touchRect!!.left && event.x <= touchRect!!.right &&
                event.y >= touchRect!!.top && event.y <= touchRect!!.bottom
            ) {
                return false
            }
        }

        return true
    }

    fun setTutorial(view: View, label: String, isInfo: Boolean) {
        this.isInfo = isInfo

        while (target == null)
            continue

        touchRect = Rect()
        view.getGlobalVisibleRect(touchRect)

        runAfterDraw(Runnable {
            post {
                setLabelPosition(touchRect!!)
                target.targetRect(touchRect!!)
                internal_container.visibility = View.VISIBLE
            }
        })
        post {
            internal_container.visibility = View.INVISIBLE
            label_text.text = label
            ok_button.visibility = if (isInfo) View.VISIBLE else View.GONE
            tutorial_label_container.invalidate()
        }
    }

    private fun setLabelPosition(rect: Rect) {
        val offset = 15

        val width = tutorial_label_container.width
        val height = tutorial_label_container.height

        var x = rect.right + offset
        var y = rect.top
        if (rect.top > height + offset) {
            x = rect.left
            y = rect.top - height - offset
        } else if (rect.left > width + offset) {
            x = rect.left - width - offset
            y = rect.top
        }

        tutorial_label_container.x = x.toFloat()
        tutorial_label_container.y = y.toFloat()
        tutorial_label_container.invalidate()
    }

    fun getOkButton(): View {
        return ok_button
    }

    private fun runAfterDraw(runnable: Runnable) {
        object : Thread() {
            override fun run() {
                tutorial_label_container.waitForDraw()
                runnable.run()
            }
        }.start()
    }
}