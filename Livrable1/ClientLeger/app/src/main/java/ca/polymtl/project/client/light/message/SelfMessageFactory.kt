package ca.polymtl.project.client.light.message

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import ca.polymtl.project.client.R

class SelfMessageFactory(context: Context) : AbsMessageFactory(context = context) {
    override fun getResource(): Int {
        return R.layout.template_message_self
    }
}