package ca.polymtl.project.client.tutorial.step

import android.view.View
import ca.polymtl.project.client.tutorial.EventInterceptor
import ca.polymtl.project.client.tutorial.TutorialLayerView
import java.util.function.BooleanSupplier

class CustomClickStep(private val label: String, private val id: Int, private val condition: BooleanSupplier) : TutorialStep() {
    override fun execute(tutorialLayerView: TutorialLayerView) {
        val view = viewToTarget<View>(tutorialLayerView, id, true)
        tutorialLayerView.setTutorial(view, label, false)

        EventInterceptor.waitForCondition(condition)
    }
}