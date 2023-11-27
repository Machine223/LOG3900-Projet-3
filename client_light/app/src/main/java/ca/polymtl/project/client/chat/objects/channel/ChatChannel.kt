package ca.polymtl.project.client.chat.objects.channel

open class ChatChannel(val channelName: String, val users: HashSet<String>) {
    val isGameChannel: Boolean = false

    fun isGeneral(): Boolean {
        return channelName == "General"
    }
}