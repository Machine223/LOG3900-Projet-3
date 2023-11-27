package ca.polymtl.project.client.chat

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import kotlinx.android.synthetic.main.view_notification.view.*

class NotificationView(context: Context, attrs: AttributeSet) : FrameLayout(context, attrs) {
    init {
        inflate(context, R.layout.view_notification, this)
    }

    fun setText(text: String?) {
        n_notifications_text.text = text
    }
}