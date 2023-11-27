package ca.polymtl.project.client.light.dispatcher

import ca.polymtl.project.client.light.manager.AbsEventManager
import ca.polymtl.project.client.light.socket.AbsEventCommunications
import ca.polymtl.project.client.light.socket.CommunicationSerializer
import com.github.nkzawa.emitter.Emitter
import java.lang.reflect.ParameterizedType

class IncomingEventDispatcher private constructor() {

    // static ->
    companion object {
        fun <T> link(manager: AbsEventManager<T>, communications: AbsEventCommunications<T>) {
            val genericClass: Class<T> = (manager.javaClass.genericSuperclass as ParameterizedType).actualTypeArguments[0] as Class<T>
            communications.addListener(Emitter.Listener { args: Array<out Any>? ->
                val obj: T = CommunicationSerializer.deserialize(args?.get(0)?.toString(), genericClass)
                manager.accept(obj)
            })
        }
    }
}