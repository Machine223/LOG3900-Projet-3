package ca.polymtl.project.client.tutorial.step

import android.widget.TextView
import ca.polymtl.project.client.tutorial.EventInterceptor
import ca.polymtl.project.client.tutorial.TutorialLayerView

class TextStep(private val label: String, private val id: Int, private val text: String) : TutorialStep() {
    override fun execute(tutorialLayerView: TutorialLayerView) {
        val view = viewToTarget<TextView>(tutorialLayerView, id, true)
        tutorialLayerView.setTutorial(view, label, false)

        EventInterceptor.waitForText(view, text)
    }
}