package ca.polymtl.project.client.chat

import android.os.Bundle
import android.view.View
import android.widget.ScrollView
import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.chat.objects.message.ChatMessage
import ca.polymtl.project.client.chat.objects.message.ChatMessageView
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.manager.NotificationManager
import kotlinx.android.synthetic.main.fragment_chat_messages.*
import kotlinx.android.synthetic.main.fragment_chat_messages.view.*
import java.util.*
import java.util.function.Consumer
import kotlin.collections.HashSet

open class ChatMessagesFragment(private val communications: ChatCommunications, private val channel: ChatChannel, private val username: String, private val onBackRunnable: Runnable) :
    InflatedLayoutFragment(R.layout.fragment_chat_messages) {

    private val messageQueue = ArrayList<ChatMessage>()
    private val messageSet = HashSet<ChatMessage>()

    init {
        communications.addReceiver(this).newMessageListener = Consumer { message: ChatMessage ->
            if (message.channelName == channel.channelName)
                acceptMessage(message)
            else {
                checkNotifications()
            }
        }
        communications.start(this)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        view.setOnTouchListener { _, _ -> true }

        checkNotifications()

        if (messageQueue.isNotEmpty()) {
            messageContainer?.post {
                messageContainer?.removeAllViews()
                for (m in messageQueue) {
                    addMessageView(m)
                }
            }
        }

        writeMessage.showSoftInputOnFocus = true
        chatChannelName.text = channel.channelName

        val sendListener = Runnable {
            val content = view.writeMessage.text.toString().trim()
            view.writeMessage.text.clear()

            if (content != "")
                communications.emitNewMessage(ChatMessage(channel.channelName, content, username))
        }

        sendMessage.setOnClickListener { sendListener.run() }
        writeMessage.setOnEditorActionListener { _, _, _ ->
            sendListener.run()
            true
        }

        chatBackButton.setOnClickListener { onBackRunnable.run() }
        chatBackButton.isEnabled = true

        loadHistoryButton.setOnClickListener {
            loadHistory()
        }

        refreshNoNewMessagesText()
    }

    protected fun loadHistory() {
        communications.pause(this)
        communications.getMessageHistory(channel,
            Consumer { history ->
                messageQueue.clear()
                messageSet.clear()
                messageContainer?.post { messageContainer?.removeAllViews() }
                for (m in history)
                    acceptMessage(m)

                communications.start(this)
            }
        )
    }

    protected open fun checkNotifications() {
        notification?.post { notification?.visibility = if (NotificationManager.nNotificationsAll() == 0) View.GONE else View.VISIBLE }
    }

    @Synchronized
    private fun acceptMessage(message: ChatMessage) {
        if (!messageSet.contains(message)) {
            messageSet.add(message)
            messageQueue.add(message)
            refreshNoNewMessagesText()
            addMessageView(message)
        }
    }

    private fun addMessageView(message: ChatMessage) {
        messageContainer?.post {
            messageContainer?.addView(ChatMessageView(requireContext(), message, message.username == username))
        }

        messageScroll?.postDelayed({
            messageScroll?.fullScroll(ScrollView.FOCUS_DOWN)
        }, 150)
    }

    private fun refreshNoNewMessagesText() {
        no_new_messages_text?.post { no_new_messages_text?.visibility = if (messageQueue.isEmpty()) View.VISIBLE else View.GONE }
    }
}
