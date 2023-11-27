package ca.polymtl.project.client.profile

import android.content.Context
import android.util.AttributeSet
import android.view.View
import android.widget.GridLayout
import androidx.core.view.setMargins


class AvatarButtonContainer(context: Context, attributes: AttributeSet?) : GridLayout(context, attributes) {
    override fun addView(child: View?) {
        super.addView(child)

        if (child != null) {
            child.layoutParams.width = 80
            child.layoutParams.height = 80
            (child.layoutParams as MarginLayoutParams).setMargins(20)
            (child.layoutParams as MarginLayoutParams).setMargins(20)
        }
    }

}