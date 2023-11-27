package ca.polymtl.project.client

import android.content.Context
import android.content.SharedPreferences

class ThemeMode(context: Context) {
    internal var themeMode: SharedPreferences
    internal var firstTheme: SharedPreferences

    init {
        themeMode = context.getSharedPreferences("filename", Context.MODE_PRIVATE)
        firstTheme = context.getSharedPreferences("filename", Context.MODE_PRIVATE)
    }

    fun setThemeModePref(state: Int?) {
        val editor = themeMode.edit()
        if (state != null) {
            editor.putInt("Night Mode", state)
        }
        editor.apply()
    }

    fun setFirstTheme(state: Int?) {
        val editor = themeMode.edit()
        if (state != null) {
            editor.putInt("first theme", state)
        }
        editor.apply()
    }

    fun loadFirstTheme(): Int {
        return firstTheme.getInt("first theme", 0)
    }

    fun loadNightMode(): Int {
        return themeMode.getInt("Night Mode", 0)
    }
}
