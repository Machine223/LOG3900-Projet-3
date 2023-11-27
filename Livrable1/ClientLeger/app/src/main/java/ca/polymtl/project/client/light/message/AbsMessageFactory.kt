package ca.polymtl.project.client.light.message

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.LinearLayout
import android.widget.TextView
import ca.polymtl.project.client.R
import java.text.SimpleDateFormat

abstract class AbsMessageFactory(private val context: Context) {
    private val DATE_FORMAT = "HH:mm:ss"

    @SuppressLint("SimpleDateFormat")
    open fun create(message: ChatMessage): View {
        val messageView = LayoutInflater.from(context).inflate(getResource(), null)

        val contentView = messageView.findViewById<TextView>(R.id.messageContentView)
        contentView.text = message.getContent()

        val timestampView = messageView.findViewById<TextView>(R.id.messageTimestampView)

        timestampView.text = SimpleDateFormat(DATE_FORMAT).format(message.getDate())

        return messageView
    }

    protected abstract fun getResource(): Int
}