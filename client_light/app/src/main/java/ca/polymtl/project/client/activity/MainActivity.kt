package ca.polymtl.project.client.activity

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import ca.polymtl.project.client.BuildConfig
import ca.polymtl.project.client.R
import ca.polymtl.project.client.ThemeMode
import ca.polymtl.project.client.chat.ChannelListFragment
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.message.ChatMessage
import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.fragment.MainMenuFragment
import ca.polymtl.project.client.fragment.ProfileDialogFragment
import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.manager.*
import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.network.SocketEventHandler
import ca.polymtl.project.client.profile.UserProfile
import ca.polymtl.project.client.tutorial.TutorialManager
import com.github.nkzawa.socketio.client.Socket
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.coroutines.sync.Mutex
import java.time.LocalTime
import java.util.function.Consumer

class MainActivity : AppCompatActivity() {
    private lateinit var profile: UserProfile
    private lateinit var socket: Socket
    private lateinit var themeMode: ThemeMode

    private val mainMenuFragment = MainMenuFragment()

    override fun onCreate(savedInstanceState: Bundle?) {

        val main = this
        val username = intent.getStringExtra("username")
        val isSignUp = intent.getBooleanExtra("isSignUp", false)

        if (BuildConfig.DEBUG && username == null) {
            error("Assertion failed")
        }

        val mutexProfile = Mutex(true)
        ProfileManager.fetchNew(username, Consumer { p ->
            if (p != null) {
                main.profile = p
                themeMode = ThemeMode(main)
                themeMode.setThemeModePref(profile.theme)
                themeMode.setFirstTheme(profile.theme)
                if (profile.theme == 1) {
                    setTheme(R.style.Theme_dark)
                } else if (profile.theme == 2) {
                    val now = LocalTime.now()
                    val hours = now.hour
                    println("Emulator Time : $now")
                    if (hours < 6 || hours >= 20) {
                        setTheme(R.style.Theme_dark)
                    } else {
                        setTheme(R.style.Theme_light)
                    }
                } else {
                    setTheme(R.style.Theme_light)
                }
            }
            mutexProfile.unlock()
        })
        while (!mutexProfile.tryLock()) {
            continue
        }

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        SoundManager.init(main)

        AvatarManager.applyAvatarOnView(self_avatar_image_view, profile.avatarName)

        self_avatar_image_view.setOnClickListener {
            val dialog = ProfileDialogFragment()
            dialog.show(supportFragmentManager, "dialogProfileSelected")
        }

        socket = NetworkManager.SocketIO.create(username!!).connect()
        ChatCommunications.newInstance(socket)
        GameCommunications.newInstance(socket)
        DrawingCommunication.newInstance(socket)


        self_user_username.text = username

        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction().add(R.id.dynamicFragment, MainMenuFragment())
                .commit()
        }

        val channelListFragment = ChannelListFragment(username)
        replace(R.id.chatFragment, channelListFragment)

        val chatVisibilityListener = ChatVisibilityListener(ChatCommunications.getInstance().newMessageHandler, notification, chat_container)
        chat_button.setOnClickListener(chatVisibilityListener)
        chatVisibilityListener.onClick(null)

        mute_button.setOnClickListener {
            if (SoundManager.isMuted) {
                SoundManager.isMuted = false
                SoundManager.unmute()
                mute_button?.post {
                    mute_button?.setBackgroundResource(R.drawable.sound_icon)
                }
            } else {
                SoundManager.isMuted = true
                SoundManager.mute()
                mute_button?.post {
                    mute_button?.setBackgroundResource(R.drawable.no_sound_icon)
                }
            }
        }
        ApplicationManager.setMainActivity(main)

        if (isSignUp)
            startTutorial()
    }

    fun setThemeMode(theme: Int) {
        themeMode.setThemeModePref(theme)
    }

    fun startTutorial() {
        TutorialManager.startTutorial(tutorial_layer)
    }

    override fun onDestroy() {
        super.onDestroy()
        SoundManager.cleanUp()
        socket.disconnect()

        ApplicationManager.removeMainActivity()
    }

    fun getProfile(): UserProfile {
        return profile
    }

    fun getSocket(): Socket {
        return socket
    }

    fun getThemeMain(): ThemeMode {
        return themeMode
    }

    fun navigateTo(destinationFragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
            .replace(R.id.dynamicFragment, destinationFragment)

        transaction.commit()
    }

    fun navigateToMainMenu() {
        navigateTo(mainMenuFragment)
    }

    fun signOut() {
        val headers = HashMap<String, String>()
        headers["username"] = getProfile().username

        NetworkManager.Rest.delete(
            "/session", headers,

            Consumer {
                val intent = Intent(this, SigningActivity::class.java)
                startActivity(intent)
                finish()
            }
        )
    }

    private fun replace(layoutId: Int, fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(layoutId, fragment).commit()
    }

    class ChatVisibilityListener(
        newMessageListener: SocketEventHandler<ChatMessage>,
        private val notification: View,
        private val chatContainer: CardView
    ) : View.OnClickListener {
        private var isHidden = false

        init {
            NotificationManager.hide(isHidden)
            newMessageListener.addListener(Consumer {
                setNotifications()
            })
        }

        override fun onClick(v: View?) {
            if (isHidden)
                show()
            else
                hide()

            isHidden = !isHidden

            NotificationManager.hide(isHidden)
            setNotifications()
        }

        private fun hide() {
            chatContainer.visibility = View.GONE
        }

        private fun show() {
            chatContainer.visibility = View.VISIBLE
        }

        private fun setNotifications() {
            notification.post { notification.visibility = if (NotificationManager.nNotificationsAll() == 0 || !isHidden) View.GONE else View.VISIBLE }
        }
    }
}