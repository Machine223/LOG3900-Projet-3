package ca.polymtl.project.client.game.results

import android.content.Context
import android.graphics.Typeface
import android.view.View
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.view_result_player.view.*
import java.util.function.Consumer
import kotlin.math.roundToInt

class ResultPlayerView(context: Context, username: String, score: ScoreBoardFragment.Score, isFFA: Boolean) : FrameLayout(context) {
    init {
        inflate(context, R.layout.view_result_player, this)

        if (isFFA) {
            score_text.visibility = View.VISIBLE
            score_text.text = "${score.score.roundToInt()}pts"

            answer_attempts_user.visibility = View.GONE
            answer_success_user.visibility = View.GONE
        } else {
            score_text.visibility = View.GONE

            answer_attempts_user.visibility = View.VISIBLE
            answer_success_user.text = score.nGoodGuesses.toString()

            answer_success_user.visibility = View.VISIBLE
            answer_attempts_user.text = score.nBadGuesses.toString()
        }

        ProfileManager.fetch(username, Consumer { profile ->
            if (profile != null) {
                AvatarManager.applyAvatarOnView(avatar_view, profile.avatarName)
                post {
                    username_text.text = profile.username
                    if (ApplicationManager.getProfile()!!.username == username)
                        username_text.typeface = Typeface.DEFAULT_BOLD
                }
            }
        })

    }
}