package ca.polymtl.project.client.profile.user

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.FrameLayout
import android.widget.Spinner
import ca.polymtl.project.client.R
import ca.polymtl.project.client.ValuedEnum
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.network.NetworkManager
import kotlinx.android.synthetic.main.view_profile_info.view.*
import java.util.*
import java.util.function.Consumer
import java.util.stream.Collectors


class ProfileInfoView(context: Context, attributeSet: AttributeSet?) : FrameLayout(context, attributeSet) {
    private val themeChanged: String = "Your changes have been saved to your profile, they will be applied at your next connection."
    private val themeChangedAuto: String = "Dark mode will be automatically applied between 08:00:00 PM and 06:00:00 AM at your next connection."

    class ThemeUser {
        var username: String = ""
        var theme: Int = 0;
    }

    enum class ThemeType : ValuedEnum {
        LIGHT_THEME {
            override fun getValue(): String {
                return "Light Mode"
            }
        },
        DARK_THEME {
            override fun getValue(): String {
                return "Dark Mode"
            }
        },
        AUTO_THEME {
            override fun getValue(): String {
                return "Automatic"
            }
        }
    }

    init {
        inflate(context, R.layout.view_profile_info, this)

        ApplicationManager.getProfile()?.let { profile ->
            AvatarManager.applyAvatarOnView(avatar_view, profile.avatarName)
            profileFirstName.text = profile.firstName
            profileLastName.text = profile.lastName
            profileUserName.text = profile.username
        }

        val currentThemeMode = ApplicationManager.getThemeMode()!!
        val firstTheme = ApplicationManager.getFirstThemeMode()!!
        theme_mode_spinner.post { theme_mode_spinner.setSelection(currentThemeMode) }
        listenForSpinnerEnumSelectionTheme(theme_mode_spinner, ThemeType.values(), Consumer { theme ->
            val selectedTheme = ThemeType.values().indexOf(theme)
            if (firstTheme != selectedTheme) {
                ApplicationManager.setThemeMode(selectedTheme)
                setThemeMode()
                text_theme_message.text = when (theme) {
                    ThemeType.LIGHT_THEME -> {
                        themeChanged
                    }
                    ThemeType.DARK_THEME -> {
                        themeChanged
                    }
                    ThemeType.AUTO_THEME -> {
                        themeChangedAuto
                    }
                }
            } else {
                ApplicationManager.setThemeMode(firstTheme)
                setThemeMode()
                text_theme_message.text = ""
            }
        })
    }

    private fun setThemeMode() {
        val themeUser = ThemeUser()

        themeUser.username = ApplicationManager.getProfile()!!.username
        themeUser.theme = ApplicationManager.getThemeMode()!!
        NetworkManager.Rest.put("/profile/theme", NetworkManager.serialize(themeUser), null,
            Consumer {
                println("SERVER : Theme mode is changed !")
            }
        )
    }


    private fun <T : ValuedEnum> listenForSpinnerEnumSelectionTheme(spinnerView: Spinner, allEnumValues: Array<T>, onSelected: Consumer<T>) {
        val allValues: List<String> = Arrays.stream(allEnumValues).map { v -> v.getValue() }.collect(Collectors.toList())
        ArrayAdapter<String>(spinnerView.context, R.layout.view_spinner_text_theme, allValues)
            .also { adapter ->
                spinnerView.adapter = adapter
            }
        spinnerView.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(_adapter: AdapterView<*>?, _view: View?, position: Int, _id: Long) {
                onSelected.accept(allEnumValues[position])
            }

            override fun onNothingSelected(_adapter: AdapterView<*>?) {}
        }
    }

}