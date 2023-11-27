package ca.polymtl.project.client.manager

import android.content.Context
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.Fragment
import ca.polymtl.project.client.activity.MainActivity
import ca.polymtl.project.client.profile.UserProfile
import com.github.nkzawa.socketio.client.Socket
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import java.util.*

object ApplicationManager {
    private var mainActivity: MainActivity? = null
    private val activityMutex = Mutex()

    fun setMainActivity(act: MainActivity) {
        GlobalScope.launch {
            activityMutex.lock()
            mainActivity = act
        }
    }

    fun removeMainActivity() {
        this.mainActivity = null
        activityMutex.unlock()
    }

    fun navigateTo(fragment: Fragment) {
        mainActivity?.navigateTo(fragment)
    }

    fun quitMain() {
        mainActivity?.signOut()
    }

    fun navigateToMainMenu() {
        mainActivity?.navigateToMainMenu()
    }

    fun getProfile(): UserProfile? {
        return mainActivity?.getProfile()
    }

    fun getSocket(): Socket? {
        return mainActivity?.getSocket()
    }

    fun setDialog(dialogFragment: DialogFragment) {
        dialogFragment.show(mainActivity!!.supportFragmentManager, null)
    }

    fun setThemeMode(theme: Int) {
        mainActivity?.setThemeMode(theme)
    }

    fun getThemeMode(): Int? {
        return mainActivity?.getThemeMain()?.loadNightMode()
    }

    fun getFirstThemeMode(): Int? {
        return mainActivity?.getThemeMain()?.loadFirstTheme()
    }

    fun startTutorial() {
        mainActivity?.startTutorial()
    }

    fun clearFocus(focusedView: TextView) {
        val imm: InputMethodManager? = mainActivity!!.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.hideSoftInputFromWindow(focusedView.windowToken, 0)
        focusedView.clearFocus()
    }

    fun <T : View> findView(id: Int): T? {
        return try {
            mainActivity?.findViewById(id)
        } catch (_: Exception) {
            null
        }
    }

    fun readFromAssets(filename: String): String {
        val s: Scanner = Scanner(mainActivity!!.assets.open(filename)).useDelimiter("\\A")
        return if (s.hasNext()) s.next() else ""
    }
}
