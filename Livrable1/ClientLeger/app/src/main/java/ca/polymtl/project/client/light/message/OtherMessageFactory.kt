package ca.polymtl.project.client.light.message

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.widget.TextView
import ca.polymtl.project.client.R

class OtherMessageFactory(context: Context) : AbsMessageFactory(context = context) {

    override fun create(message: ChatMessage): View {
        val messageView: View = super.create(message)

        val author = message.getAuthor()
        val avatarView = messageView.findViewById<TextView>(R.id.messageUserAvatar)
        avatarView.text = author[0].toString().toUpperCase()

        val usernameView = messageView.findViewById<TextView>(R.id.messageUsername)
        usernameView.text = author

        return messageView
    }

    override fun getResource(): Int {
        return R.layout.template_message_other
    }}