package ca.polymtl.project.client.chat

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.LinearLayout
import android.widget.RelativeLayout
import androidx.core.view.children
import androidx.fragment.app.Fragment
import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.chat.objects.channel.ChatChannelEdit
import ca.polymtl.project.client.chat.objects.channel.ChatChannelItemView
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.NotificationManager
import kotlinx.android.synthetic.main.fragment_channels.*
import java.util.function.Consumer

class ChannelListFragment(private val username: String) : InflatedLayoutFragment(R.layout.fragment_channels) {
    private val communications = ChatCommunications.getInstance()

    private val channelItemViews = HashMap<String, ChatChannelItemView>()
    private val chatMessagesFragments = HashMap<String, ChatMessagesFragment>()

    private val onUseChannelListener = Consumer { c: ChatChannel ->
        val cv = channelItemViews[c.channelName]!!
        NotificationManager.viewChat(cv.data)
        cv.refreshData()

        setChatFragment(chatMessagesFragments[c.channelName]!!)
    }

    init {
        val receiver = communications.addReceiver(this)

        receiver.newChannelListener = Consumer { channel: ChatChannel ->
            createChannelView(channel)
        }

        receiver.newMessageListener = Consumer { message ->
            val channelView = channelItemViews[message.channelName]!!
            NotificationManager.newMessage(channelView.data)
            channelView.refreshData()
        }

        receiver.deleteChannelListener = Consumer { channel: ChatChannel ->
            val channelView = channelItemViews[channel.channelName]
            if (channelView != null) {
                channelItemViews.remove(channel.channelName)
                chatMessagesFragments.remove(channel.channelName)
                removeChannelView(channelView)
            }
        }

        receiver.addUserListener = Consumer { channelEdit: ChatChannelEdit ->
            val channelItemView = channelItemViews[channelEdit.channelName]
            if (channelItemView != null) {
                channelItemView.addUser(channelEdit)
                if (channelEdit.username == username) {
                    refreshChannelView(channelItemView)
                }
            }
        }

        receiver.removeUserListener = Consumer { channelEdit: ChatChannelEdit ->
            val channelItemView = channelItemViews[channelEdit.channelName]
            if (channelItemView != null) {
                channelItemView.removeUser(channelEdit)
                if (channelEdit.username == username) {
                    chatMessagesFragments.remove(channelEdit.channelName)
                    refreshChannelView(channelItemView)
                }
            }
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        view.setOnTouchListener { v, event -> true }

        communications.getAllChannels(Consumer { channels: List<ChatChannel> ->
            channels.forEach { c: ChatChannel -> createChannelView(c) }
        })

        val newChannelRunnable = Runnable {
            val newChannelName = newChannelNameText.text.toString().trim()
            newChannelNameText.text.clear()

            if (newChannelName != "" && !channelItemViews.containsKey(newChannelName)) {
                val users = HashSet<String>()
                users.add(username)
                communications.emitNewChannel(ChatChannel(newChannelName, users))
                ApplicationManager.clearFocus(newChannelNameText)
            }
        }

        newChannelNameText.setOnEditorActionListener { _, _, _ ->
            newChannelRunnable.run()
            true
        }
        newChannelButton.setOnClickListener {
            newChannelRunnable.run()
        }


        filterChannelsText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            }

            override fun afterTextChanged(s: Editable?) {
                filterChannels()
            }
        })

        removeChatFragment()
        refreshCategoryVisibility()

        communications.start(this)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        communications.pause(this)
    }

    private fun refreshChannelView(channelItemView: ChatChannelItemView) {
        removeChannelView(channelItemView)
        displayChannelView(channelItemView)
    }

    private fun createChannelView(chatChannel: ChatChannel) {
        val channelView = ChatChannelItemView(requireContext(), chatChannel, username, communications)
        channelView.setOnUseChannelListener(onUseChannelListener)

        channelItemViews[chatChannel.channelName] = channelView
        displayChannelView(channelView)
    }

    private fun displayChannelView(channelItemView: ChatChannelItemView?) {
        if (channelItemView != null) {
            if (channelItemView.data.isGameChannel)
                return

            if (channelItemView.isJoined()) {
                NotificationManager.addChannel(channelItemView.data)
                if (channelItemView.data.channelName !in chatMessagesFragments.keys) {
                    val chatMessagesFragment = channelItemView.createChatMessagesFragment(Runnable {
                        removeChatFragment()
                        NotificationManager.leaveChat(channelItemView.data)
                        channelItemView.refreshData()
                    })
                    chatMessagesFragments[channelItemView.data.channelName] = chatMessagesFragment
                }
                joinedChannelsContainer?.post {
                    if (channelItemView.data.isGeneral()) {
                        joinedChannelsContainer?.addView(channelItemView, 0)
                    } else {
                        joinedChannelsContainer?.addView(channelItemView)
                    }

                    refreshCategoryVisibility()
                }
            } else {
                NotificationManager.removeChannel(channelItemView.data)
                nonJoinedChannelsContainer?.post {
                    nonJoinedChannelsContainer.addView(channelItemView)
                    refreshCategoryVisibility()
                }
            }

            filterChannels()
        }
    }

    private fun removeChannelView(channelItemView: ChatChannelItemView?) {
        joinedChannelsContainer?.post {
            joinedChannelsContainer?.removeView(channelItemView)
            nonJoinedChannelsContainer?.removeView(channelItemView)
            refreshCategoryVisibility()
        }
    }

    private fun setChatFragment(fragment: ChatMessagesFragment) {
        parentFragmentManager.beginTransaction().replace(R.id.chatMessagesContainer, fragment).commit()
    }

    private fun removeChatFragment() {
        parentFragmentManager.beginTransaction().replace(R.id.chatMessagesContainer, Fragment()).commit()
    }

    private fun filterChannels() {
        val filter = filterChannelsText?.text.toString()
        filterChannelsInLayout(filter, joinedChannelsContainer)
        filterChannelsInLayout(filter, nonJoinedChannelsContainer)
        refreshCategoryVisibility()
    }

    private fun filterChannelsInLayout(filter: String, layout: LinearLayout) {
        val lowerFilter = filter.toLowerCase()
        for (view in layout.children) {
            if (view is ChatChannelItemView) {
                if (view.data.channelName.toLowerCase().contains(lowerFilter))
                    view.visibility = View.VISIBLE
                else
                    view.visibility = View.GONE
            }
        }
    }

    private fun refreshCategoryVisibility() {
        val isJoinedVisible = refreshCategoryVisibility(joined_channels_container, joinedChannelsContainer)
        val isNonJoinedVisible = refreshCategoryVisibility(available_channels_container, nonJoinedChannelsContainer)
        separator.visibility = if (isJoinedVisible && isNonJoinedVisible)
            View.VISIBLE
        else
            View.GONE
    }

    private fun refreshCategoryVisibility(layout: RelativeLayout, container: LinearLayout): Boolean {
        var visibleCount = 0
        for (view in container.children) {
            if (view is ChatChannelItemView) {
                if (view.visibility == View.VISIBLE)
                    visibleCount++
            }
        }

        return if (visibleCount > 0) {
            layout.visibility = View.VISIBLE
            true
        } else {
            layout.visibility = View.GONE
            false
        }
    }
}
