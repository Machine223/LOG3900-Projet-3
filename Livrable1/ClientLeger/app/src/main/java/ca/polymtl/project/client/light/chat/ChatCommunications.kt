package ca.polymtl.project.client.light.chat

import ca.polymtl.project.client.light.message.ChatMessage
import ca.polymtl.project.client.light.socket.AbsEventCommunications
import com.github.nkzawa.socketio.client.Socket


class ChatCommunications(socket: Socket) : AbsEventCommunications<ChatMessage>(event = "chat message", socket = socket)
