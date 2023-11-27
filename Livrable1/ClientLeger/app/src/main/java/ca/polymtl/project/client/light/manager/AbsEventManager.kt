package ca.polymtl.project.client.light.manager

import ca.polymtl.project.client.light.socket.AbsEventCommunications

abstract class AbsEventManager<T>(private val communications: AbsEventCommunications<T>) {

    open fun emit(obj: T) {
        communications.emit(obj)
    }

    abstract fun accept(obj: T)
}