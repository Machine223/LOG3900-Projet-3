package ca.polymtl.project.client.chat.communications

import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.chat.objects.channel.ChatChannelEdit
import ca.polymtl.project.client.chat.objects.message.ChatMessage
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.network.CommunicationsHandler
import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.network.SocketEventHandler
import com.github.nkzawa.socketio.client.Socket
import org.json.JSONObject
import java.util.function.Consumer
import java.util.function.Supplier


class ChatCommunications private constructor(socket: Socket) : CommunicationsHandler<ChatCommunications.Dispatcher>(Supplier { Dispatcher() }) {
    companion object {
        private var instance: ChatCommunications? = null

        fun newInstance(socket: Socket) {
            instance = ChatCommunications(socket)
        }

        fun getInstance(): ChatCommunications {
            return instance!!
        }
    }

    class Dispatcher : CommunicationsHandler.EventDispatcher() {
        var newMessageListener = Consumer<ChatMessage> { }
        var newChannelListener = Consumer<ChatChannel> { }
        var deleteChannelListener = Consumer<ChatChannel> { }
        var addUserListener = Consumer<ChatChannelEdit> { }
        var removeUserListener = Consumer<ChatChannelEdit> { }
    }

    val newMessageHandler = SocketEventHandler<ChatMessage>(socket, "chat_message_new")

    private val newChannelHandler = SocketEventHandler<ChatChannel>(socket, "channel_new")
    private val deleteChannelHandler = SocketEventHandler<ChatChannel>(socket, "channel_delete")

    private val addUserHandler = SocketEventHandler<ChatChannelEdit>(socket, "channel_add_user")
    private val removeUserHandler = SocketEventHandler<ChatChannelEdit>(socket, "channel_remove_user")


    init {
        newMessageHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.newMessageListener, data)
        })

        newChannelHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.newChannelListener, data)
        })

        deleteChannelHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.deleteChannelListener, data)
        })

        addUserHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.addUserListener, data)
        })

        removeUserHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.removeUserListener, data)
        })
    }


    /**
     * MESSAGES
     */

    fun getMessageHistory(channel: ChatChannel, historyConsumer: Consumer<List<ChatMessage>>) {
        NetworkManager.Rest.get("chat/${channel.channelName}", null, Consumer { data ->
            val messageArrayString = JSONObject(data).getJSONArray("messages").toString()
            val messageList: List<ChatMessage> = NetworkManager.deserialize(messageArrayString, Array<ChatMessage>::class.java).toList()
            historyConsumer.accept(messageList)
        })
    }

    fun emitNewMessage(message: ChatMessage) {
        newMessageHandler.emit(message)
    }

    /**
     * CHANNELS
     */

    fun getAllChannels(channelsConsumer: Consumer<List<ChatChannel>>) {
        NetworkManager.Rest.get("channels", null, Consumer { channelsString ->
            val rawChannels = JSONObject(channelsString).getJSONArray("channels").toString()

            val channelArray: Array<ChatChannel> = NetworkManager.deserialize(rawChannels, Array<ChatChannel>::class.java)
            channelsConsumer.accept(
                    channelArray.toList()
            )
        })
    }


    fun emitNewChannel(channel: ChatChannel) {
        newChannelHandler.emit(channel)
    }

    fun emitDeleteChannel(channel: ChatChannel) {
        deleteChannelHandler.emit(channel)
    }

    fun emitAddUser(channelEdit: ChatChannelEdit) {
        addUserHandler.emit(channelEdit)
    }

    fun emitRemoveUser(channelEdit: ChatChannelEdit) {
        removeUserHandler.emit(channelEdit)
    }
}
