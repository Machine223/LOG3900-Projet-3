package ca.polymtl.project.client.game

import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import ca.polymtl.project.client.R
import ca.polymtl.project.client.ValuedEnum
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.manager.ApplicationManager
import kotlinx.android.synthetic.main.fragment_game_parameters.*
import java.util.*
import java.util.function.Consumer
import java.util.stream.Collectors

class GameParametersFragment : InflatedLayoutFragment(R.layout.fragment_game_parameters) {
    private var gameMode = GameRoom.GameMode.FREE_FOR_ALL
    private var gameDifficulty = GameRoom.GameDifficulty.EASY

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        back_button.setOnClickListener { ApplicationManager.navigateToMainMenu() }
        listenForSpinnerEnumSelection(game_mode_spinner, GameRoom.GameMode.values(), Consumer { gameMode ->
            this.gameMode = gameMode
        })
        listenForSpinnerEnumSelection(game_difficulty_spinner, GameRoom.GameDifficulty.values(), Consumer { gameDifficulty ->
            this.gameDifficulty = gameDifficulty
        })

        find_button.setOnClickListener {
            val gameRoomListFragment = GameRoomListFragment(ApplicationManager.getProfile()!!, Runnable { ApplicationManager.navigateTo(this) })
            gameRoomListFragment.setParameters(this.gameMode, this.gameDifficulty)

            ApplicationManager.navigateTo(gameRoomListFragment)
        }
    }

    private fun <T : ValuedEnum> listenForSpinnerEnumSelection(spinnerView: Spinner, allEnumValues: Array<T>, onSelected: Consumer<T>) {
        val allValues: List<String> = Arrays.stream(allEnumValues).map { v -> v.getValue() }.collect(Collectors.toList())
        ArrayAdapter<String>(spinnerView.context, R.layout.view_spinner_text, allValues)
            .also { adapter ->
                spinnerView.adapter = adapter
            }
        spinnerView.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(_adapter: AdapterView<*>?, _view: View?, position: Int, _id: Long) {
                onSelected.accept(allEnumValues[position])
            }

            override fun onNothingSelected(_adapter: AdapterView<*>?) {}
        }
    }
}