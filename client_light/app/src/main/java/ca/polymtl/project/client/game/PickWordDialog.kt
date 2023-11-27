package ca.polymtl.project.client.game

import android.graphics.Typeface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.view.setPadding
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import kotlinx.android.synthetic.main.dialog_pick_word.*
import java.util.function.Consumer

class PickWordDialog(private val words: Array<String>, private val pickConsumer: Consumer<String>) : DialogFragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        isCancelable = false
        return inflater.inflate(R.layout.dialog_pick_word, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        for (word in words) {
            val textView = TextView(requireContext())
            textView.textSize = 20.0f
            textView.setPadding(15)
            textView.typeface = Typeface.DEFAULT_BOLD
            context?.let { ContextCompat.getColor(it, R.color.colorPrimary) }?.let { textView.setTextColor(it) }
            textView.text = word
            textView.setOnClickListener {
                pickConsumer.accept(word)
            }

            words_container.addView(textView)
        }
    }
}