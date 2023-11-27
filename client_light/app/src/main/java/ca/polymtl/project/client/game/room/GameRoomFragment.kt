package ca.polymtl.project.client.game.room

import android.content.Context
import android.graphics.Typeface
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.InGameChatFragment
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.fragment.VirtualPlayersDialogFragment
import ca.polymtl.project.client.game.manager.GameManager
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.fragment_game_room.*
import kotlinx.android.synthetic.main.view_player_avatar.view.*
import java.util.function.Consumer


abstract class GameRoomFragment(protected val gameRoom: GameRoom, private val gameManager: GameManager) : InflatedLayoutFragment(R.layout.fragment_game_room) {


    private class PlayerAvatarView(context: Context, val username: String, private val onRemove: Consumer<String>) : FrameLayout(context) {
        init {
            inflate(context, R.layout.view_player_avatar, this)

            ProfileManager.fetch(username, Consumer { profile ->
                AvatarManager.applyAvatarOnView(avatar_view, profile!!.avatarName)
            })

            if (ProfileManager.isVirtualPlayer(username)) {
                remove_button.visibility = View.VISIBLE
                remove_button.setOnClickListener {
                    onRemove.accept(username)
                }
            } else {
                remove_button.visibility = View.GONE
            }

            username_text.text = username
            if (username == ApplicationManager.getProfile()!!.username)
                username_text.typeface = Typeface.DEFAULT_BOLD
        }
    }

    private var chatChannel: ChatChannel? = null

    private val onRemoveUser = Consumer<String> { username ->
        gameManager.removeUser(username)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        leave_container.setOnClickListener {
            gameManager.leaveGameroom()
        }
        game_room_name.text = gameRoom.gameroomName
        game_mode_name_text.text = gameRoom.getGameMode().getValue()
        game_difficulty_name_text.text = gameRoom.getDifficulty().getValue()



        add_virtual_player_button.setOnClickListener {
            val onClickConsumer = Consumer<String> { name ->
                gameManager.addUser(name)
            }
            val dialog = VirtualPlayersDialogFragment(onClickConsumer)
            parentFragmentManager.let { it1 -> dialog.show(it1, "dialogVirtualPlayers") }
        }

        setChat(chatChannel)

        checkValidity()

        start_button_game_room.setOnClickListener {
            gameManager.emitStartGame()
        }

        refreshPlayerViews()
    }

    fun addNewPlayer(username: String) {
        gameRoom.addUser(username)
        refreshPlayerViews()
    }

    fun removePlayer(username: String) {
        gameRoom.removeUser(username)
        refreshPlayerViews()
    }

    protected fun setInvalid(message: String) {
        start_button_game_room.isEnabled = false
        context?.let { ContextCompat.getColor(it, R.color.white) }?.let { start_button_game_room.setTextColor(it) }
        context?.let { ContextCompat.getColor(it, R.color.colorPrimaryContrast) }?.let { start_button_game_room.setBackgroundColor(it) }
        invalid_message_container.text = message
    }

    protected fun setValid() {
        start_button_game_room.isEnabled = true
        context?.let { ContextCompat.getColor(it, R.color.white) }?.let { start_button_game_room.setTextColor(it) }
        context?.let { ContextCompat.getColor(it, R.color.colorPrimary) }?.let { start_button_game_room.setBackgroundColor(it) }
        invalid_message_container.text = ""
    }

    protected abstract fun checkValidity()

    protected abstract fun getVirtualPlayerLimit(): Int

    protected abstract fun getPlayerLimit(): Int

    fun setChat(chatChannel: ChatChannel?) {
        this.chatChannel = chatChannel
        if (this.chatChannel != null && context != null) {
            val chatMessagesFragment = InGameChatFragment(ChatCommunications.getInstance(), this.chatChannel!!, ApplicationManager.getProfile()!!.username)
            parentFragmentManager.beginTransaction()
                .replace(R.id.chat_container, chatMessagesFragment).commit()
        }
    }

    private fun refreshPlayerViews() {
        lobby_players?.post {
            if (context != null) {
                lobby_players.removeAllViews()
                for (username in gameRoom.getAllUsers()) {
                    lobby_players.addView(PlayerAvatarView(requireContext(), username, onRemoveUser))
                }

                checkValidity()
                setAddVirtualPlayerVisibility()
            }
        }
    }

    private fun setAddVirtualPlayerVisibility() {
        add_virtual_player_button?.visibility = if (gameRoom.getVirtualUsers().size >= getVirtualPlayerLimit() || gameRoom.getAllUsers().size >= getPlayerLimit()) View.GONE else View.VISIBLE
        if (!add_virtual_player_button.isVisible) {
            add_virtuel_player_text.text = ""
        } else {
            add_virtuel_player_text.text = "Add virtual player"
        }
    }
}