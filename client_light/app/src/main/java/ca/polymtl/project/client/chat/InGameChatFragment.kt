package ca.polymtl.project.client.chat

import android.os.Bundle
import android.view.View
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import kotlinx.android.synthetic.main.fragment_chat_messages.*


class InGameChatFragment(communications: ChatCommunications, channel: ChatChannel, username: String) : ChatMessagesFragment(communications, channel, username, Runnable { }) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        chat_information_container.visibility = View.GONE
        loadHistory()
    }

    override fun checkNotifications() {
        // No notifications
    }

}