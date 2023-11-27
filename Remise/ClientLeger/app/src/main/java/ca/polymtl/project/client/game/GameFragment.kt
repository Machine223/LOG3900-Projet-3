package ca.polymtl.project.client.game


import android.os.Bundle
import android.view.View
import androidx.annotation.CallSuper
import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.InGameChatFragment
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.game.manager.GameManager
import ca.polymtl.project.client.game.objects.*
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import kotlinx.android.synthetic.main.fragment_game.*
import kotlinx.coroutines.sync.Mutex

abstract class GameFragment(protected val gameRoom: GameRoom, private val scoreBoardFragment: ScoreBoardFragment, protected val gameManager: GameManager) : InflatedLayoutFragment(R.layout.fragment_game) {
    private var chatChannel: ChatChannel? = null

    private var gameTimer: GameTimer = GameTimer()

    private val shittyAssMutex = Mutex(true)

    @CallSuper
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        layoutInflater.inflate(getDynamicComponentLayoutId(), dynamic_component_card_view)
        gameTimer.setTimerView(timer, warning)

        setChat(chatChannel)
        setGuessViewList()

        parentFragmentManager.beginTransaction()
            .replace(R.id.score_board_container, scoreBoardFragment).commit()

        shittyAssMutex.unlock()
    }

    @CallSuper
    override fun onDestroyView() {
        super.onDestroyView()
        gameTimer.stop()
    }

    fun setChat(chatChannel: ChatChannel?) {
        this.chatChannel = chatChannel
        if (this.chatChannel != null && context != null) {
            val chatMessagesFragment = InGameChatFragment(ChatCommunications.getInstance(), this.chatChannel!!, ApplicationManager.getProfile()!!.username)
            parentFragmentManager.beginTransaction()
                .replace(R.id.private_chat_fragment, chatMessagesFragment).commit()
        }
    }

    private fun setGuessViewList() {}

    abstract fun updateScore(newScore: NewScore)

    abstract fun wordGoodGuessConsumed(goodGuess: WordGoodGuess)

    abstract fun wordBadGuessConsumed(badGuess: WordBadGuess)

    abstract fun hintAskedConsumed(hintAsked: HintAsked)

    abstract fun attemptBadGuess(badGuess: WordBadGuess)

    abstract fun getDynamicComponentLayoutId(): Int

    abstract fun attemptConsumed()

    @CallSuper
    open fun turnStart(turnStart: TurnStart) {
        while (!shittyAssMutex.tryLock())
            continue
        gameTimer.start(turnStart.endTimestamp)
    }

    abstract fun setHints(hints: Array<String>)

    @CallSuper
    open fun turnEnd() {
        gameTimer.stop()
    }

    abstract fun setChosenWord(word: String)
}