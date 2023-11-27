package ca.polymtl.project.client.tutorial.step

import ca.polymtl.project.client.tutorial.EventInterceptor
import ca.polymtl.project.client.tutorial.TutorialLayerView
import java.util.function.BooleanSupplier

class CustomWaitStep(private val condition: BooleanSupplier) : TutorialStep() {
    override fun execute(tutorialLayerView: TutorialLayerView) {
        EventInterceptor.waitForCondition(condition)
    }
}
