package ca.polymtl.project.client.game.results

import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.dialog_results.*
import java.util.stream.Collectors

class FFAResultsDialog(private val scores: HashMap<String, ScoreBoardFragment.Score>, private val dismissRunnable: Runnable) : DialogFragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        isCancelable = true
        return inflater.inflate(R.layout.dialog_results, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val playerResultEntries = scores.entries.stream()
            .filter { entry -> !ProfileManager.isVirtualPlayer(entry.key) }
            .sorted { o1, o2 -> o2.value.score.compareTo(o1.value.score) }
            .collect(Collectors.toList())

        title_text.post { title_text.text = "Winner:" }
        title_result_text.post { title_result_text.text = playerResultEntries[0].key }

        player_container.post { playerResultEntries.forEach { entry -> player_container.addView(ResultPlayerView(requireContext(), entry.key, entry.value, true)) } }
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)

        dismissRunnable.run()
    }
}