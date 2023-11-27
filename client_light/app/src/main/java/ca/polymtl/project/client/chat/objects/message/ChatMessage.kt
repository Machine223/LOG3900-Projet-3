package ca.polymtl.project.client.chat.objects.message

import java.util.*

class ChatMessage(val channelName: String, val content: String, val username: String) {
    private val timestamp: Long = 0

    fun getDate() = Date(timestamp)

    override fun equals(other: Any?): Boolean {
        if (other != null && other is ChatMessage) {
            return timestamp == other.timestamp && content == other.content
        }

        return false
    }

    override fun hashCode(): Int {
        return Objects.hash(content, timestamp)
    }
}