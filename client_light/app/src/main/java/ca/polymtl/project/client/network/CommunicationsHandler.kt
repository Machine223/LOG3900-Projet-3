package ca.polymtl.project.client.network

import java.util.function.Consumer
import java.util.function.Supplier

abstract class CommunicationsHandler<T : CommunicationsHandler.EventDispatcher>(private val receiverBuilder: Supplier<T>) {
    abstract class EventDispatcher {
        private val eventQueue = EventQueue()

        fun start() {
            eventQueue.start()
        }

        fun pause() {
            eventQueue.pause()
        }

        fun <T> newEvent(consumer: Consumer<T>, element: T) {
            eventQueue.newEvent(Runnable { consumer.accept(element) })
        }
    }

    private val receivers = HashMap<Any, T>()

    fun addReceiver(fragment: Any): T {
        val receiver = receiverBuilder.get()
        receivers[fragment] = receiver
        return receiver
    }

    fun start(fragment: Any) {
        receivers[fragment]?.start()
    }

    fun pause(fragment: Any) {
        receivers[fragment]?.pause()
    }

    fun removeReceiver(fragment: Any) {
        receivers.remove(fragment)
    }

    fun getReceivers(): List<T> {
        return receivers.map { entry -> entry.value }
    }

    fun clearListeners() {
        for (field in this.javaClass.fields) {
            if (field.type is SocketEventHandler<*>) {
                val fieldValue = field.get(Object())
                fieldValue.javaClass.getDeclaredMethod("clearListeners").invoke(fieldValue)
            }
        }
    }
}