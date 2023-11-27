package ca.polymtl.project.client.game

import android.content.Context
import android.util.AttributeSet
import android.view.View
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import ca.polymtl.project.client.R
import ca.polymtl.project.client.R.color
import kotlinx.android.synthetic.main.view_hint_container.view.*

class HintsView(context: Context, attributeSet: AttributeSet?) : RelativeLayout(context, attributeSet) {
    private var hints = emptyArray<String>()
    private var nShownHints = 0

    init {
        inflate(context, R.layout.view_hint_container, this)
    }

    fun setData(hints: Array<String>, onHintRequested: Runnable) {
        this.hints = hints
        this.nShownHints = 0

        post {
            setRequestVisibility()
            request_hint_button?.setOnClickListener { onHintRequested.run() }
        }
    }

    fun showNextHint() {
        if (hints.size > nShownHints) {
            post {
                addHintText(hints[nShownHints])
                nShownHints++

                setRequestVisibility()
            }
        }
    }

    private fun setRequestVisibility() {
        request_hint_button.visibility = if (hints.size <= nShownHints) View.GONE else View.VISIBLE
    }

    private fun addHintText(hint: String) {
        val hintTextView = TextView(context)
        hintTextView.text = hint
        hintTextView.setTextColor(ContextCompat.getColor(context, color.colorPrimary))
        hintTextView.textSize = 18F

        hint_container_layout.addView(hintTextView, hint_container_layout.childCount - 1)
        hint_container_scroll_view.fullScroll(View.FOCUS_DOWN)
    }
}