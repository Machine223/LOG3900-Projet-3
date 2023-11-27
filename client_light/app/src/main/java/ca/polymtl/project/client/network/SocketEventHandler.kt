package ca.polymtl.project.client.network

import android.util.Log
import com.github.nkzawa.socketio.client.Socket
import org.json.JSONObject
import java.lang.reflect.ParameterizedType
import java.util.function.Consumer
import kotlin.math.min


class SocketEventHandler<T>(private val socket: Socket, private val event: String) {
    private val listeners = ArrayList<Consumer<T>>()
    private var isInitialized = false

    fun emit(obj: T) {
        val jsonObj = NetworkManager.serialize(obj)
        socket.emit(event, jsonObj)
    }

    fun addListener(listener: Consumer<T>) {
        listeners.add(listener)
        initializeSocket(listener)
    }

    fun clearListeners() {
        listeners.clear()
    }

    private fun initializeSocket(listener: Consumer<T>) {
        if (isInitialized)
            return

        val genericClass = (listener::class.java.genericInterfaces[0] as ParameterizedType).actualTypeArguments[0] as Class<T>
        socket.on(event) { args: Array<out Any>? ->
            val obj: T = NetworkManager.deserialize(args?.get(0)?.toString(), genericClass)
            for (list in listeners)
                list.accept(obj)
        }

        isInitialized = true
    }
}