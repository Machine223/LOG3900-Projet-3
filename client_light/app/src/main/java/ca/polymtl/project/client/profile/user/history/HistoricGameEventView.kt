package ca.polymtl.project.client.profile.user.history

import android.content.Context
import android.view.View
import android.widget.FrameLayout
import androidx.core.content.ContextCompat
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import ca.polymtl.project.client.network.NetworkManager
import kotlinx.android.synthetic.main.view_historic_game.view.*
import kotlinx.android.synthetic.main.view_history_player.view.*
import org.json.JSONObject
import java.util.function.Consumer
import kotlin.math.roundToInt

class HistoricGameEventView(gameJson: JSONObject, context: Context) : HistoricEventView(gameJson.getLong("startTime"), R.layout.view_historic_game, context) {
    private class Game {
        val gameMode: Int = 0
        val scores: Map<String, Float> = HashMap()

        val startTime: Long = 0
        val endTime: Long = 0
    }

    private open class HistoryPlayerView(username: String, score: Int, context: Context) : FrameLayout(context) {
        init {
            inflate(context, R.layout.view_history_player, this)

            username_text.text = username
            ProfileManager.fetch(username, Consumer { profile ->
                AvatarManager.applyAvatarOnView(avatar_view, profile!!.avatarName)
            })

            if (ProfileManager.isVirtualPlayer(username) || score < 0) {
                score_text.visibility = View.INVISIBLE
            } else {
                score_text.visibility = View.VISIBLE
                score_text.text = score.toString()
            }
        }
    }

    private class ScorelessPlayerView(username: String, context: Context) : HistoryPlayerView(username, -1, context)

    private var isExpanded = false


    init {
        val game = NetworkManager.deserialize(gameJson.toString(), Game::class.java)
        val gameMode = GameRoom.GameMode.values()[game.gameMode]

        game_mode_text.text = gameMode.getValue()

        var nReal = 0
        var nVirtual = 0
        game.scores.keys.forEach { username -> if (ProfileManager.isVirtualPlayer(username)) nVirtual++ else nReal++ }
        number_players_human_text.text = nReal.toString()
        number_players_robot_text.text = nVirtual.toString()

        toggle_button.setOnClickListener {
            toggle()
        }

        setExpanded(isExpanded)

        /*-------------------------*/

        val isFFA = gameMode == GameRoom.GameMode.FREE_FOR_ALL
        val maxEntry = game.scores.entries.stream().max { entry0, entry1 -> entry0.value.compareTo(entry1.value) }.get()
        info_title.text = if (isFFA) {
            String.format("Winner: %s", maxEntry.key)
        } else {
            String.format("Final score: %s", maxEntry.value.roundToInt())
        }

        game.scores.entries.stream().sorted { o1, o2 -> o2.value.compareTo(o1.value) }.forEach { (username, score) ->
            val destination = if (ProfileManager.isVirtualPlayer(username)) virtual_players else real_players
            destination.addView(createPlayerView(username, score.roundToInt(), isFFA))
        }
    }

    private fun createPlayerView(username: String, score: Int, isFFA: Boolean): HistoryPlayerView {
        return if (isFFA) HistoryPlayerView(username, score, context) else ScorelessPlayerView(username, context)
    }

    override fun setTimestamp() {
        timestamp_text.text = formatTimestamp(TIME_FORMAT)
    }


    private fun toggle() {
        isExpanded = !isExpanded
        setExpanded(isExpanded)
    }

    private fun setExpanded(state: Boolean) {
        info_container.visibility = if (state) {
            toggle_button.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_up_arrow))
            View.VISIBLE
        } else {
            toggle_button.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_down_arrow))
            View.GONE
        }
    }

}