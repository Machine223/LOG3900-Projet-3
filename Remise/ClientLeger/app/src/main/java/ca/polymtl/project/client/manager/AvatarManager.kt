package ca.polymtl.project.client.manager

import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.profile.AvatarView
import com.caverock.androidsvg.SVG
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import org.json.JSONObject
import java.util.function.Consumer

object AvatarManager {
    private var svgMap: HashMap<String, SVG>? = null
    private var avatarNames: List<String>? = null

    private val mutex = Mutex()

    fun supplyNames(nameListener: Consumer<List<String>>) {
        GlobalScope.launch {
            fetch(Consumer { nameListener.accept(avatarNames!!) })
        }
    }

    fun applyAvatarOnView(view: AvatarView, avatarName: String) {
        GlobalScope.launch {
            fetch(Consumer { map ->
                view.post { view.setSVG(map[avatarName]) }
            })
        }
    }

    private suspend fun fetch(consumer: Consumer<HashMap<String, SVG>>) {
        mutex.lock()

        if (svgMap != null) {
            mutex.unlock()

            consumer.accept(svgMap!!)
        } else {
            svgMap = HashMap()

            val getMutexes = arrayOf(Mutex(true), Mutex(true))
            fetchAvatarsFromServer("/avatar/all", Consumer { map ->
                map.forEach { entry -> svgMap!![entry.key] = entry.value }
                avatarNames = map.keys.toList()
                getMutexes[0].unlock()
            })
            fetchAvatarsFromServer("/avatar/all-virtual", Consumer { map ->
                map.forEach { entry -> svgMap!![entry.key] = entry.value }
                getMutexes[1].unlock()
            })

            getMutexes.forEach { m -> m.lock() }
            mutex.unlock()

            consumer.accept(svgMap!!)
        }
    }


    private fun fetchAvatarsFromServer(endpoint: String, consumer: Consumer<HashMap<String, SVG>>) {
        NetworkManager.Rest.get(
            endpoint, null,
            Consumer { data ->
                consumer.accept(processAvatars(data))
            }
        )
    }

    private fun processAvatars(rawData: String): HashMap<String, SVG> {
        val map = HashMap<String, SVG>()

        val avatarArray = JSONObject(rawData).getJSONArray("avatars")

        for (i in 0 until avatarArray.length()) {
            val avatarObject = avatarArray.getJSONObject(i)

            val name = avatarObject.getString("name")
            val rawSvg = avatarObject.getString("svg")
            val svg = SVG.getFromString(rawSvg)

            map[name] = svg
        }

        return map
    }
}