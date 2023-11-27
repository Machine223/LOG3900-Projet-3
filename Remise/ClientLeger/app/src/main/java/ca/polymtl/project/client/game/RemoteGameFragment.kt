package ca.polymtl.project.client.game

import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.core.content.ContextCompat
import ca.polymtl.project.client.R
import ca.polymtl.project.client.draw.communications.RemoteSupplier
import ca.polymtl.project.client.draw.manager.RemoteDrawingManager
import ca.polymtl.project.client.game.manager.GameManager
import ca.polymtl.project.client.game.objects.*
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import kotlinx.android.synthetic.main.fragment_game.*
import kotlinx.android.synthetic.main.fragment_local_drawing.canvas_view
import kotlinx.android.synthetic.main.view_dynamic_remote_game.*
import java.util.function.Consumer

class RemoteGameFragment(
    gameRoom: GameRoom,
    scoreBoardFragment: ScoreBoardFragment,
    gameManager: GameManager,
    drawingSupplier: RemoteSupplier
) : GameFragment(
    gameRoom, scoreBoardFragment, gameManager
) {
    private val drawingManager: RemoteDrawingManager =
        RemoteDrawingManager(gameRoom, drawingSupplier, Runnable { canvas_view?.invalidate() })

    private var attemptsLeft: Int = -1

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        canvas_view.setOnDrawHandler(Consumer { canvas -> drawingManager.renderToCanvas(canvas) })

        attemptListener()

        if (gameRoom.getGameMode() == GameRoom.GameMode.FREE_FOR_ALL) {
            attempts_count_header.visibility = View.GONE
            attempts_count_header.height = 0
            attempts_counter.visibility = View.GONE
            attempts_counter.height = 0
        }
    }


    private fun attemptListener() {
        enter_guess?.setOnEditorActionListener { _, _, _ ->
            val guess = enter_guess?.text?.trim().toString().toLowerCase()
            enter_guess?.text?.clear()
            if (guess.isNotEmpty()) {
                ApplicationManager.clearFocus(enter_guess)
                gameManager.emitGuess(guess)
            }
            true
        }
    }

    private fun attemptPost(guess: String) {
        attempts_list.post {
            val tv = TextView(requireContext())
            tv.text = guess
            tv.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_baseline_close_24_red, 0, 0, 0)
            tv.compoundDrawablePadding = 10
            tv.textSize = 18F
            tv.setPadding(35, 0, 0, 0)
            context?.let { ContextCompat.getColor(it, R.color.colorPrimary) }?.let { tv.setTextColor(it) }
            attempts_list.addView(tv)
        }
        attempts_list_scroll.post {
            attempts_list_scroll.fullScroll(View.FOCUS_DOWN)
        }
    }

    override fun attemptBadGuess(badGuess: WordBadGuess) {
        attemptPost(badGuess.word)
    }

    override fun getDynamicComponentLayoutId(): Int {
        return R.layout.view_dynamic_remote_game
    }

    override fun onDestroyView() {
        super.onDestroyView()
        drawingManager.endDrawing()
    }

    override fun updateScore(newScore: NewScore) {
    }

    override fun wordGoodGuessConsumed(goodGuess: WordGoodGuess) {
        if (goodGuess.username == ApplicationManager.getProfile()!!.username) {
            enter_guess?.post { enter_guess?.isEnabled = false }
        }
    }

    override fun wordBadGuessConsumed(badGuess: WordBadGuess) {
        when (gameRoom.getGameMode()) {
            GameRoom.GameMode.FREE_FOR_ALL -> {
                if (badGuess.username == ApplicationManager.getProfile()!!.username)
                    attemptPost(badGuess.word)
            }
            else -> attemptPost(badGuess.word)
        }
    }

    override fun turnStart(turnStart: TurnStart) {
        super.turnStart(turnStart)

        attemptsLeft = turnStart.nAttempts
        attempts_counter?.post {
            attempts_counter?.text = attemptsLeft.toString()
        }

        drawingManager.startDrawing()
    }

    override fun turnEnd() {
        super.turnEnd()
        attempts_counter?.post {
            attempts_counter?.text = "0"
        }
        drawingManager.clearElements()
        attempts_list?.post {
            attempts_list?.removeAllViews()
            attempts_list_scroll?.fullScroll(View.FOCUS_UP)
        }

        drawingManager.endDrawing()
    }

    override fun attemptConsumed() {
        attemptsLeft -= 1
        attempts_counter?.post {
            attempts_counter?.text = attemptsLeft.toString()
        }
    }


    override fun setHints(hints: Array<String>) {
        object : Thread() {
            override fun run() {
                while (hints_view == null) {
                    sleep(50)
                }

                hints_view.setData(hints, Runnable {
                    if (gameRoom.getGameMode() == GameRoom.GameMode.FREE_FOR_ALL)
                        hints_view?.showNextHint()

                    gameManager.emitHintAsked()
                })
            }
        }.start()
    }


    override fun setChosenWord(word: String) {}

    override fun hintAskedConsumed(hintAsked: HintAsked) {
        if (gameRoom.getGameMode() != GameRoom.GameMode.FREE_FOR_ALL)
            hints_view?.showNextHint()
    }
}