package ca.polymtl.project.client.activity

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import ca.polymtl.project.client.R
import ca.polymtl.project.client.fragment.SignUpDialogFragment
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.profile.AvatarView
import com.google.android.material.button.MaterialButton
import kotlinx.android.synthetic.main.activity_sign_up.*
import java.util.function.Consumer
import java.util.regex.Matcher
import java.util.regex.Pattern

class SigningActivity : AppCompatActivity() {
    private val hideError: Runnable = Runnable { hideAlert() }
    private var currentViewId: Int = -1
    private val signUpData = SignUpData()
    lateinit var passwordRegex: Regex

    class SignUpData {
        var username: String? = null
        var password: String? = null
        var firstName: String? = null
        var lastName: String? = null
        var avatarName: String? = null

        fun checkValid(): Boolean {
            return checkValid(username) && checkValid(password) && checkValid(firstName) && checkValid(lastName) && checkValid(avatarName)
        }

        private fun checkValid(s: String?): Boolean {
            return s != null && s.isNotEmpty()
        }
    }

    companion object {
        private const val LAYOUT_ID = R.layout.activity_signing
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setSignInAttributes()
        hideAlert()
        passwordRegex = Regex("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,16}\$")
    }


    private fun setSignInAttributes() {
        val signInFunction = View.OnClickListener {
            hideAlert()
            signIn()
        }
        val switchFunction = View.OnClickListener {
            hideAlert()
            setSignUpAttributes()
        }
        setSigningAttributes(signInFunction, switchFunction)
    }

    private fun setSignUpAttributes() {
        val signUpFunction = View.OnClickListener {
            hideAlert()
            signUp()
        }
        val switchFunction = View.OnClickListener {
            hideAlert()
            setSignInAttributes()

        }
        setSigningAttributes(signUpFunction, switchFunction)
        setAvatarListener()
    }

    private fun setAvatarListener() {
        val selectAvatarListener = View.OnClickListener {
            it.apply {

                val onClickConsumer = Consumer { name: String ->
                    signUpData.avatarName = name
                    onAvatarSelected()
                }
                val dialog = SignUpDialogFragment(onClickConsumer)
                dialog.show(supportFragmentManager, "dialogAvatarSelect")
            }
        }

        findViewById<MaterialButton>(R.id.avatar_Button_SignUp)?.setOnClickListener(selectAvatarListener)
        view_avatar_signUp?.setOnClickListener(selectAvatarListener)
    }

    private fun onAvatarSelected() {
        if (signUpData.avatarName != null) {
            val avatarView = findViewById<AvatarView>(R.id.view_avatar_signUp)
            AvatarManager.applyAvatarOnView(avatarView, signUpData.avatarName!!)
        }
    }

    private fun setSigningAttributes(
        buttonAction: View.OnClickListener,
        switchAction: View.OnClickListener
    ) {
        currentViewId = if (currentViewId == LAYOUT_ID) {
            setContentView(R.layout.activity_sign_up)
            R.layout.activity_sign_up

        } else {
            setContentView(LAYOUT_ID)
            LAYOUT_ID
        }

        val buttonView = this.findViewById<Button>(R.id.signingButton)
        buttonView.setOnClickListener(buttonAction)

        buttonView.setOnClickListener(buttonAction)
        val switchView = this.findViewById<TextView>(R.id.signingSwitch)
        switchView.setOnClickListener(switchAction)

    }

    private fun signIn() {
        val username: String = findViewById<EditText>(R.id.signInUsername).text.toString()
        val password: String = findViewById<EditText>(R.id.signInPassword).text.toString()
        if (checkEmpty(username, password)) {
            addAlert("Empty fields not permitted!", 5)
            return
        }

        val headers = HashMap<String, String>()
        headers["username"] = username
        headers["password"] = password

        NetworkManager.Rest.get("/session", headers,
            Consumer {
                openMainMenu(username, false)
            },
            Consumer { code ->
                when (code) {
                    400 -> addAlert("400 : User already connected!", 5)
                    401 -> addAlert("401 : Invalid credentials!", 5)
                    else -> {
                        val errorName = "Unexpected Error!"
                        addAlert(errorName, 5)
                    }
                }
            }
        )
    }

    private fun signUp() {
        signUpData.username = findViewById<EditText>(R.id.signUpUsername).text.toString()
        signUpData.password = findViewById<EditText>(R.id.signUpPassword).text.toString()
        signUpData.firstName = findViewById<EditText>(R.id.signUpFirstName).text.toString()
        signUpData.lastName = findViewById<EditText>(R.id.signUpLastName).text.toString()

        if (!signUpData.checkValid()) {
            addAlert("Empty fields not permitted!", 5)
            return
        }

        if(!passwordRegex.containsMatchIn(signUpData.password!!)){
            addAlert("Password does not meet the security requirements!", 5)
            return
        }

        NetworkManager.Rest.post("/profile", NetworkManager.serialize(signUpData), null,
            Consumer {
                signUpData.avatarName?.let { openMainMenu(signUpData.username!!, true) }
            },
            Consumer { code ->
                when (code) {
                    400 -> addAlert("400 : User exists already!", 5)
                    else -> {
                        val errorName = "Unexpected Error!"
                        addAlert(errorName, 5)
                    }
                }
            }
        )
    }

    private fun checkEmpty(vararg params: String): Boolean {
        for (p in params) {
            if (p == "") {
                return true
            }
        }

        return false
    }

    private fun addAlert(message: String, nSeconds: Int) {
        val alert = alertElement()
        alert.removeCallbacks(hideError)
        alert.post {
            alert.text = message
            alert.visibility = View.VISIBLE
        }
        alert.postDelayed(hideError, 1000 * nSeconds.toLong())
    }

    private fun hideAlert() {
        val alert = alertElement()
        alert.visibility = View.INVISIBLE
    }

    @SuppressLint("WrongViewCast")
    fun alertElement(): TextView {
        return findViewById<TextView>(R.id.alertElement)
    }

    private fun openMainMenu(username: String, isSignUp: Boolean) {
        val intent = Intent(this, MainActivity::class.java)
        intent.putExtra("username", username)
        intent.putExtra("isSignUp", isSignUp)
        startActivity(intent)
        finish()
    }
}
