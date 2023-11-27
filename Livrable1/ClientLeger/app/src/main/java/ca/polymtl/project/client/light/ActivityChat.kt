package ca.polymtl.project.client.light

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.*
import android.view.inputmethod.EditorInfo
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import ca.polymtl.project.client.R
import ca.polymtl.project.client.light.chat.ChatCommunications
import ca.polymtl.project.client.light.dispatcher.IncomingEventDispatcher
import ca.polymtl.project.client.light.chat.ChatManager
import ca.polymtl.project.client.light.network.NetworkManager
import com.github.nkzawa.socketio.client.Socket
import com.google.android.material.snackbar.Snackbar
import com.squareup.okhttp.*
import kotlinx.android.synthetic.main.activity_chat.*
import java.io.IOException

class ActivityChat : AppCompatActivity() {

    private lateinit var socket: Socket

    // to remove, only here to make logout work
    private var username: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN)


        username = intent.getStringExtra("username")
        socket = NetworkManager.SocketIO.create(username)

        val userAvatarView = findViewById<TextView>(R.id.userAvatar)
        userAvatarView.text = username[0].toString().toUpperCase()

        val usernameView = findViewById<TextView>(R.id.username)
        usernameView.text = username

        val chatCommunications = ChatCommunications(socket)
        val chatManager = ChatManager(messageContainer, chatCommunications, username, this)
        IncomingEventDispatcher.link(chatManager, chatCommunications)

        writeMessage.showSoftInputOnFocus = true
        val send = SendMessageListener(
            writeMessage,
            chatManager
        )

        val enterClick = object : TextView.OnEditorActionListener {
            override fun onEditorAction(v: TextView?, actionId: Int, event: KeyEvent?): Boolean {
                if (actionId == EditorInfo.IME_ACTION_NEXT || actionId == EditorInfo.IME_ACTION_DONE) {
                    send.onClick(v)
                    return true
                }

                return false
            }
        }

        sendMessage.setOnClickListener(send)
        writeMessage.setOnEditorActionListener(enterClick)

        socket.connect()
    }

    override fun onDestroy() {
        super.onDestroy()
        socket.disconnect()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }

    // To remove and put elsewhere, only here to make logout work
    fun signOut(v: View) {
        val json = "{\"username\":\"$username\"}".trimIndent()
        NetworkManager.Rest.post("auth/signout", json, null, object : Callback {
            override fun onFailure(request: Request?, e: IOException?) {
                Log.e("RESPONSE_FAILURE", "Something happened")
                e?.printStackTrace()
                Snackbar.make(findViewById(R.id.chatWindow), "Signout failed", Snackbar.LENGTH_SHORT).show()
            }

            override fun onResponse(response: Response?) {
                if (response?.isSuccessful!!) {
                    openLogin(v)
                } else {
                    Log.e("RESPONSE_UNSUCCESSFUL", "CODE --> " + response.code().toString() + " " + response.message())
                    Snackbar.make(findViewById(R.id.chatWindow), "Signout failed", Snackbar.LENGTH_SHORT).show()
                }
            }
        })
    }


    // To remove and elsewhere, only here to make logout work
    fun openLogin(v: View) {
        val intent = Intent(this, ActivitySigning::class.java)
        startActivity(intent)
        finish()
    }

    private class SendMessageListener(
        private val textElement: EditText,
        private val chatManager: ChatManager
    ) : View.OnClickListener {

        override fun onClick(v: View?) {
            val text = textElement.text.toString().trim()
            textElement.text.clear()

            if (text == "")
                return

            chatManager.newMessage(text)
        }
    }
}
