package ca.polymtl.project.client.tutorial.step

import android.view.View
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.tutorial.TutorialLayerView

abstract class TutorialStep {

    abstract fun execute(tutorialLayerView: TutorialLayerView)

    protected fun <T : View> viewToTarget(tutorialLayerView: TutorialLayerView, id: Int, passEvents: Boolean): T {
        var view: T? = null
        while (view == null || !view.isLaidOut)
            view = ApplicationManager.findView<T>(id)
        return view
    }
}
