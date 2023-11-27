package ca.polymtl.project.client.light.socket

import com.github.nkzawa.emitter.Emitter
import com.github.nkzawa.socketio.client.Socket

abstract class AbsEventCommunications<T>(private val event: String, private val socket: Socket) {
    fun emit(obj: T) {
        val jsonObj = CommunicationSerializer.serialize(obj)
        socket.emit(event, jsonObj)
    }

    fun addListener(listener: Emitter.Listener) {
        socket.on(event, listener)
    }
}