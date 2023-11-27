package ca.polymtl.project.client.light

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
import ca.polymtl.project.client.light.network.NetworkManager
import com.squareup.okhttp.Callback
import com.squareup.okhttp.Request
import com.squareup.okhttp.Response
import java.io.IOException

class ActivitySigning : AppCompatActivity() {
    private val hideError : Runnable = Runnable{ hideAlert() }
    companion object {
        private const val LAYOUT_ID = R.layout.activity_signing
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(LAYOUT_ID)
        setSignInAttributes()
        hideAlert()
    }

    fun setSignInAttributes() {
        val signInFunction = View.OnClickListener {
            hideAlert()
            signIn()
        }
        val switchFunction = View.OnClickListener {
            hideAlert()
            setSignUpAttributes()
        }

        setSigningAttributes("Login", "Login", signInFunction, "Register", switchFunction)
    }

    fun setSignUpAttributes() {
        val signInFunction = View.OnClickListener {
            hideAlert()
            signUp()
        }
        val switchFunction = View.OnClickListener {
            hideAlert()
            setSignInAttributes()
        }

        setSigningAttributes("Register", "Register", signInFunction, "Cancel", switchFunction)
    }

    fun setSigningAttributes(title: String, buttonText: String, buttonAction: View.OnClickListener, switchText: String, switchAction: View.OnClickListener) {
        val titleView = this.findViewById<TextView>(R.id.signingTitle)
        titleView.text = title

        val buttonView = this.findViewById<Button>(R.id.signingButton)
        buttonView.text = buttonText
        buttonView.setOnClickListener(buttonAction)

        val switchView = this.findViewById<TextView>(R.id.signingSwitch)
        switchView.text = switchText
        switchView.setOnClickListener(switchAction)
    }

    fun signIn() {
        val username: String = findViewById<EditText>(R.id.loginUsername).text.toString()
        val password: String = findViewById<EditText>(R.id.loginPassword).text.toString()
        if (checkEmpty(username, password)) {
            addAlert("Empty fields not permitted!", 5)
            return
        }

        val headers = HashMap<String, String>()
        headers.put("username", username)
        headers.put("password", password)

        NetworkManager.Rest.get("/auth/signin", headers, object : Callback {
            override fun onFailure(request: Request?, e: IOException?) {
                val errorName = "Unexpected Error!"
                Log.e("RESPONSE_FAILURE", errorName)
                e?.printStackTrace()
                addAlert(errorName, 5)
            }

            override fun onResponse(response: Response?) {
                if (response?.isSuccessful!!) {
                    openChat(username)
                } else {
                    when (response.code()) {
                        400 -> addAlert("400 : User already connected!", 5)
                        401 -> addAlert("401 : Invalid credentials!", 5)
                    }
                }
            }
        })
    }

    fun signUp() {
        val username: String = findViewById<EditText>(R.id.loginUsername).text.toString()
        val password: String = findViewById<EditText>(R.id.loginPassword).text.toString()
        if (checkEmpty(username, password)) {
            addAlert("Empty fields not permitted!", 5)
            return
        }

        val json = """
            {
                "username":"$username",
                "password":"$password"
            }
        """.trimIndent()

        NetworkManager.Rest.post("/auth/signup", json, null, object : Callback {
            override fun onFailure(request: Request?, e: IOException?) {
                val errorName = "Unexpected Error!"
                Log.e("RESPONSE_FAILURE", errorName)
                e?.printStackTrace()
                addAlert(errorName, 5)
            }

            override fun onResponse(response: Response?) {
                if (response?.isSuccessful!!) {
                    openChat(username)
                } else {
                    when (response.code()) {
                        400 -> addAlert("400 : User exists already!", 5)
                    }
                }
            }
        })
    }

    fun checkEmpty(vararg params: String): Boolean {
        for (p in params) {
            if (p == "") {
                return true
            }
        }

        return false
    }

    fun addAlert(message: String, nSeconds: Int) {
        val alert = alertElement()
        alert.removeCallbacks(hideError)
        alert.post {
            alert.text = message
            alert.visibility = View.VISIBLE
        }
        alert.postDelayed(hideError, 1000 * nSeconds.toLong())
    }

    fun hideAlert() {
        val alert = alertElement()
        alert.visibility = View.INVISIBLE
    }

    @SuppressLint("WrongViewCast")
    fun alertElement(): TextView {
        return findViewById<TextView>(R.id.alertElement)
    }

    fun openChat(username: String) {
        val intent = Intent(this, ActivityChat::class.java)
        intent.putExtra("username", username)
        startActivity(intent)
        finish()
    }
}