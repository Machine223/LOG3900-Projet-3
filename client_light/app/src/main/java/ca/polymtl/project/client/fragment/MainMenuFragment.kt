package ca.polymtl.project.client.fragment

import android.os.Bundle
import android.view.View
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.GameParametersFragment
import ca.polymtl.project.client.manager.ApplicationManager
import kotlinx.android.synthetic.main.fragment_main_menu.*

class MainMenuFragment : InflatedLayoutFragment(R.layout.fragment_main_menu) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        play_button.setOnClickListener {
            ApplicationManager.navigateTo(GameParametersFragment())
        }

        tutorial_button.setOnClickListener { ApplicationManager.startTutorial() }

        quit_button.setOnClickListener {
            ApplicationManager.quitMain()
        }
    }
}