package ca.polymtl.project.client.chat.objects.channel

import android.app.AlertDialog
import android.content.Context
import android.graphics.Typeface
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import androidx.core.content.ContextCompat
import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.ChatMessagesFragment
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.manager.NotificationManager
import kotlinx.android.synthetic.main.view_chat_channel.view.*
import java.util.function.Consumer


class ChatChannelItemView(context: Context, val data: ChatChannel, private val username: String, private val communications: ChatCommunications) : FrameLayout(context) {
    init {
        inflate(context, R.layout.view_chat_channel, this)
        refreshData()

        channelActionButton.setOnClickListener {
            val edit = ChatChannelEdit(data.channelName, username)
            if (isJoined())
                communications.emitRemoveUser(edit)
            else
                communications.emitAddUser(edit)
        }

        deleteChannelButton.setOnClickListener {

            val dialog: AlertDialog.Builder = AlertDialog.Builder(context)
            dialog.setTitle("Confirmation")
            dialog.setMessage("Are you sure you want to delete ${data.channelName} ?")
            dialog.setCancelable(true)

            dialog.setPositiveButton(
                    "Yes"
            ) { dialog, id ->
                // Continue with some operation
                communications.emitDeleteChannel(data)
            }

            dialog.setNegativeButton(
                    "No"
            ) { dialog, id -> // User cancelled the dialog
                dialog.cancel()
            }
            val alert: AlertDialog = dialog.create()
            alert.show()
            context.let { ContextCompat.getColor(it, R.color.colorPrimary) }.let { alert.getButton(AlertDialog.BUTTON_POSITIVE).setTextColor(it) }
            context.let { ContextCompat.getColor(it, R.color.colorPrimary) }.let { alert.getButton(AlertDialog.BUTTON_NEGATIVE).setTextColor(it) }
            val layoutParams = WindowManager.LayoutParams()
            layoutParams.copyFrom(alert.getWindow().attributes)
            layoutParams.width = 650
            layoutParams.height = 300
            alert.getWindow().attributes = layoutParams
        }
    }

    fun addUser(edit: ChatChannelEdit) {
        data.users.add(edit.username)
        refreshData()
    }

    fun removeUser(edit: ChatChannelEdit) {
        data.users.remove(edit.username)
        refreshData()
    }

    fun refreshData() {
        Handler(Looper.getMainLooper()).post {
            chatChannelName.text = data.channelName
            channelPopulation.text = data.users.size.toString()
            deleteChannelButton.visibility = if (isJoined() && !data.isGameChannel) View.VISIBLE else View.GONE
            personImage.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_baseline_person_24))

            val actionDrawable = if (isJoined()) R.drawable.ic_baseline_remove_24 else R.drawable.ic_baseline_add_24

            channelActionButton.visibility = if (data.isGameChannel) View.GONE else View.VISIBLE
            channelActionButton.setImageDrawable(ContextCompat.getDrawable(context, actionDrawable))
            if(isJoined()) channelActionButton.tooltipText = "Remove channel" else channelActionButton.tooltipText = "Add channel"


            val nNotifications = NotificationManager.nNotifications(data)
            notification_text.visibility = if (nNotifications == 0) View.GONE else View.VISIBLE
            notification_text.setText(nNotifications.toString())

            if (data.isGeneral()) {
                chatChannelName.typeface = Typeface.DEFAULT_BOLD
                channelActionButton.visibility = View.GONE
                deleteChannelButton.visibility = View.GONE
            }
        }
    }

    fun isJoined(): Boolean {
        return username in data.users
    }

    fun createChatMessagesFragment(onBack: Runnable): ChatMessagesFragment {
        return ChatMessagesFragment(communications, data, username, onBack)
    }

    fun setOnUseChannelListener(listener: Consumer<ChatChannel>) {
        chatChannelName.setOnClickListener {
            if (isJoined()) {
                listener.accept(data)
            }
        }
    }
}