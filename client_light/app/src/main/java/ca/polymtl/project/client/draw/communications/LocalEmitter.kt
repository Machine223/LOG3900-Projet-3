package ca.polymtl.project.client.draw.communications

import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.communications.primitive.ElementPrimitive
import ca.polymtl.project.client.draw.communications.primitive.NewPartsPrimitive

interface LocalEmitter {
    fun emitNewElement(elementPrimitive: ElementPrimitive)

    fun emitNewCoordinates(newPartsPrimitive: NewPartsPrimitive)

    fun emitDeleteElement(elementPrimitive: ElementPrimitive)

    fun emitUndeleteElement(elementPrimitive: ElementPrimitive)

    fun emitEditBackground(backgroundPrimitive: BackgroundPrimitive)
}