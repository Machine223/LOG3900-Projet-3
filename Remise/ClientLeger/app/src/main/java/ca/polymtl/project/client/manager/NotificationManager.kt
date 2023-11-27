package ca.polymtl.project.client.manager

import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.chat.objects.message.ChatMessage

object NotificationManager {
    private class ChannelStatus {
        var isJoined = false
        var nNotifications = 0
    }

    private val statusData = HashMap<String, ChannelStatus>()
    var isHidden = false

    fun hide(isHidden: Boolean) {
        this.isHidden = isHidden
        if (!isHidden) {
            statusData.values.forEach { s -> if (s.isJoined) s.nNotifications = 0 }
        }
    }

    fun newMessage(message: ChatMessage) {
        newMessage(message.channelName)
    }

    fun newMessage(channel: ChatChannel) {
        newMessage(channel.channelName)
    }

    private fun newMessage(channel: String) {
        if (!statusData.containsKey(channel))
            return

        val status = getStatus(channel)
        if (isHidden || !status.isJoined){
            status.nNotifications += 1
            SoundManager.playSoundEffect(R.raw.you_got_mail)
        }
    }

    fun nNotifications(channel: ChatChannel): Int {
        if (statusData.containsKey(channel.channelName))
            return getStatus(channel.channelName).nNotifications
        return 0
    }

    fun nNotificationsAll(): Int {
        return statusData.values.filter { status -> isHidden || !status.isJoined }.map { status -> status.nNotifications }.sum()
    }

    fun viewChat(channel: ChatChannel) {
        val status = getStatus(channel.channelName)
        status.isJoined = true
        status.nNotifications = 0
    }

    fun leaveChat(channel: ChatChannel) {
        getStatus(channel.channelName).isJoined = false
    }

    fun addChannel(channel: ChatChannel) {
        statusData[channel.channelName] = ChannelStatus()
    }

    fun removeChannel(channel: ChatChannel) {
        statusData.remove(channel.channelName)
    }

    private fun getStatus(channel: String): ChannelStatus {
        return statusData[channel]!!
    }
}