package ca.polymtl.project.client.game.objects

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Typeface
import android.view.View
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.view_player_guess.view.*
import java.util.function.Consumer


@SuppressLint("ViewConstructor")
class PlayerGuessView(username: String, score: ScoreBoardFragment.Score, context: Context) : FrameLayout(context) {
    private var nGoodGuess: Int = score.nGoodGuesses
    private var nBadGuess: Int = score.nBadGuesses

    init {
        View.inflate(context, R.layout.view_player_guess, this)

        ProfileManager.fetch(username, Consumer { profile ->
            AvatarManager.applyAvatarOnView(guess_user_avatar, profile!!.avatarName)
            guess_user_name.text = username
        })

        if (ApplicationManager.getProfile()!!.username == username) {
            guess_user_name.typeface = Typeface.DEFAULT_BOLD
        }

        setGuessCount()
    }

    fun goodGuess() {
        post {
            good_answer.animate().alpha(0.3f).duration = 200
            nGoodGuess += 1
            setGuessCount()
        }
    }

    fun badGuess() {
        flash(bad_answer)
        post {
            nBadGuess += 1
            setGuessCount()
        }
    }

    private fun flash(view: View) {
        post {
            view.alpha = 0.3f
            view.animate().alpha(0.0f).duration = 1000
        }
    }

    private fun setGuessCount() {
        answer_success_user.text = nGoodGuess.toString()
        answer_attempts_user.text = nBadGuess.toString()
    }
}