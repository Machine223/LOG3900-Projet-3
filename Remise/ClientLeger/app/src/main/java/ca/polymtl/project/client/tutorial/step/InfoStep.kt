package ca.polymtl.project.client.tutorial.step

import android.view.View
import ca.polymtl.project.client.tutorial.EventInterceptor
import ca.polymtl.project.client.tutorial.TutorialLayerView

class InfoStep(private val label: String, private val id: Int) : TutorialStep() {
    override fun execute(tutorialLayerView: TutorialLayerView) {
        val view = viewToTarget<View>(tutorialLayerView, id, false)
        tutorialLayerView.setTutorial(view, label, true)

        EventInterceptor.waitForOk(tutorialLayerView.getOkButton())
    }
}