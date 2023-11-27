package ca.polymtl.project.client.draw.tools.actions

import android.graphics.drawable.GradientDrawable
import android.util.Log
import android.view.View
import ca.polymtl.project.client.draw.ColorData
import ca.polymtl.project.client.draw.communications.LocalEmitter
import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.manager.LocalDrawingManager

class ChangeBackgroundAction(private val fromColor: ColorData, private val toColor: ColorData, private val button: View) : Action {

    override fun redo(drawingManager: LocalDrawingManager, emitter: LocalEmitter) {
        emitter.emitEditBackground(BackgroundPrimitive(drawingManager.gameRoom.gameroomName, toColor.colorAsString(), toColor.opacity))
        drawingManager.setBackground(toColor.colorAsString())
        drawingManager.setOpacity(toColor.opacity)
        drawingManager.colorDataBackground = toColor
        (button.background as GradientDrawable).setColor(toColor.color)
        button.alpha = toColor.opacity
    }

    override fun undo(drawingManager: LocalDrawingManager, emitter: LocalEmitter) {
        emitter.emitEditBackground(BackgroundPrimitive(drawingManager.gameRoom.gameroomName, fromColor.colorAsString(), fromColor.opacity))
        drawingManager.setBackground(fromColor.colorAsString())
        drawingManager.setOpacity(fromColor.opacity)
        drawingManager.colorDataBackground = fromColor
        (button.background as GradientDrawable).setColor(fromColor.color)
        button.alpha = fromColor.opacity
    }
}