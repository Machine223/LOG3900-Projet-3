package ca.polymtl.project.client.light.chat

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.ScrollView
import android.widget.TextView
import ca.polymtl.project.client.light.message.ChatMessage
import ca.polymtl.project.client.light.message.OtherMessageFactory
import ca.polymtl.project.client.light.message.SelfMessageFactory
import ca.polymtl.project.client.light.manager.AbsEventManager
import org.w3c.dom.Text
import java.util.*
import kotlin.collections.HashMap
import kotlin.collections.HashSet

class ChatManager(private val layout: ViewGroup, chatCommunications: ChatCommunications, self: String, context: Context) : AbsEventManager<ChatMessage>(chatCommunications) {
    private var SELF = "light"

    private val scrollView: ScrollView = (layout.parent as ScrollView)

    private val selfMessageFactory: SelfMessageFactory = SelfMessageFactory(context)
    private val otherMessageFactory: OtherMessageFactory = OtherMessageFactory(context)

    init {
        SELF = self
        scrollDown()
    }

    private fun addMessageView(view: View) {
        layout.post {
            run {
                layout.addView(view)
                scrollDown()
            }
        }
    }

    private fun scrollDown() {
        scrollView.post { kotlin.run { scrollView.fullScroll(ScrollView.FOCUS_DOWN) } }
    }

    override fun accept(obj: ChatMessage) {
        val view: View = if (obj.getAuthor() == SELF)
            selfMessageFactory.create(obj)
        else
            otherMessageFactory.create(obj)
        addMessageView(view)
    }

    fun newMessage(content: String) {
        val message = ChatMessage(content, SELF, Date())
        emit(message)
    }
}