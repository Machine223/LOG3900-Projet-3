package ca.polymtl.project.client.chat.objects.message

import android.content.Context
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.view_other_chat_message.view.*
import kotlinx.android.synthetic.main.view_self_chat_message.view.messageContentView
import kotlinx.android.synthetic.main.view_self_chat_message.view.messageTimestampView
import java.text.SimpleDateFormat
import java.util.function.Consumer

class ChatMessageView(context: Context, message: ChatMessage, isAuthor: Boolean) :
    FrameLayout(context) {
    companion object {
        private val DATE_FORMAT = SimpleDateFormat("hh:mm:ss aa")
    }

    init {
        val view = if (isAuthor)
            inflate(context, R.layout.view_self_chat_message, this)
        else
            inflate(context, R.layout.view_other_chat_message, this)
        view.messageContentView.text = message.content
        view.messageTimestampView.text = DATE_FORMAT.format(message.getDate())


        if (!isAuthor) {

            val author = message.username
            ProfileManager.fetch(author, Consumer { profile ->
                AvatarManager.applyAvatarOnView(messageUserAvatar, profile!!.avatarName)
            })
            view.messageUsername.text = author
        }
    }


}