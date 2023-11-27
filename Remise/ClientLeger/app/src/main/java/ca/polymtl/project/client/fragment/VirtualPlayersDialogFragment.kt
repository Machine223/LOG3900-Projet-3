package ca.polymtl.project.client.fragment

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.fragment_game_room_dialog.*
import kotlinx.android.synthetic.main.view_virtual_player_selection_item.view.*
import java.util.function.Consumer


class VirtualPlayersDialogFragment(private val onClickConsumer: Consumer<String>) : DialogFragment() {
    @SuppressLint("ViewConstructor")
    class VirtualPlayerSelectionItemView(context: Context, private val username: String) : FrameLayout(context) {
        init {
            inflate(context, R.layout.view_virtual_player_selection_item, this)
            ProfileManager.fetch(username, Consumer { profile ->
                AvatarManager.applyAvatarOnView(avatar_view, profile!!.avatarName)
                username_text.text = username
            })
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_game_room_dialog, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        for (virtualPlayer in ProfileManager.getVirtualPlayers()) {
            val selectionItemView = VirtualPlayerSelectionItemView(requireContext(), virtualPlayer)
            selectionItemView.setOnClickListener {
                onClickConsumer.accept(virtualPlayer)
                this.dismiss()
            }
            virtual_player_container.addView(selectionItemView)
        }
    }
}