package ca.polymtl.project.client.manager

import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.profile.UserProfile
import ca.polymtl.project.client.tutorial.TutorialManager
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import java.util.function.Consumer

object ProfileManager {
    private val virtualPlayers = HashSet<String>(
        listOf(
            "Virtual Vincent",
            "Virtual Simon",
            "Virtual Hakim",
            "Virtual Abderrahim",
            "Virtual Rostyslav",
            "Virtual Xi Chen"
        )
    )

    private val profileCache = HashMap<String, UserProfile>()

    private val mutex = Mutex()

    fun getVirtualPlayers(): List<String> {
        return virtualPlayers.toList()
    }

    fun isVirtualPlayer(username: String): Boolean {
        return virtualPlayers.contains(username)
    }

    fun fetch(username: String, consumer: Consumer<UserProfile?>) {
        val tutorial = getTutorialProfile()
        if (TutorialManager.isTutorialMode() && username == tutorial.username) {
            consumer.accept(tutorial)
            return
        }

        if (isVirtualPlayer(username)) {
            consumer.accept(UserProfile(username, "", "", "", username, 0))
            return
        }

        GlobalScope.launch {
            mutex.lock()

            if (profileCache.containsKey(username)) {
                mutex.unlock()

                consumer.accept(profileCache[username])
            } else {
                fetchFromServer(username, Consumer { profile ->
                    if (profile != null)
                        profileCache[username] = profile
                    mutex.unlock()

                    consumer.accept(profile)
                })
            }
        }
    }

    fun fetchNew(username: String, consumer: Consumer<UserProfile?>) {
        if (!isVirtualPlayer(username))
            profileCache.remove(username)
        fetch(username, consumer)
    }

    fun getTutorialProfile(): UserProfile {
        return UserProfile("Tutorial", "", "", "", "batman", 0)
    }

    private fun fetchFromServer(username: String, consumer: Consumer<UserProfile?>) {
        NetworkManager.Rest.get("/profile/$username", null, Consumer { data ->
            val profile = NetworkManager.deserialize(data, UserProfile::class.java)
            consumer.accept(profile)
        }, Consumer { code ->
            consumer.accept(null)
        })
    }
}