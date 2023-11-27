package ca.polymtl.project.client.draw.communications

import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.communications.primitive.NewPartsPrimitive
import java.util.function.Consumer

interface RemoteSupplier {
    fun setOnNewElementListener(listener: Consumer<ElementPrimitive>)

    fun setOnNewCoordinatesListener(listener: Consumer<NewPartsPrimitive>)


    fun setOnDeleteElementListener(listener: Consumer<ElementPrimitive>)

    fun setOnUndeleteElementListener(listener: Consumer<ElementPrimitive>)


    fun setOnEditBackgroundListener(listener: Consumer<BackgroundPrimitive>)

    fun start()
    fun stop()
}