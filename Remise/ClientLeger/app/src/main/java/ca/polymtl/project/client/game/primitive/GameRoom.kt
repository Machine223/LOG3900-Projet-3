package ca.polymtl.project.client.game.primitive

import ca.polymtl.project.client.ValuedEnum
import ca.polymtl.project.client.manager.ProfileManager

class GameRoom(val gameroomName: String, private val gameMode: Int, private val difficulty: Int, private val users: ArrayList<String>, var isInGame: Boolean) {
    enum class GameMode : ValuedEnum {
        FREE_FOR_ALL {
            override fun getValue(): String {
                return "Free-for-all"
            }
        },
        SPRINT_SOLO {
            override fun getValue(): String {
                return "Sprint solo"
            }
        },
        SPRINT_COOP {
            override fun getValue(): String {
                return "Sprint coop"
            }
        }
    }

    enum class GameDifficulty : ValuedEnum {
        EASY {
            override fun getValue(): String {
                return "Easy"
            }
        },
        MODERATE {
            override fun getValue(): String {
                return "Moderate"
            }
        },
        DIFFICULT {
            override fun getValue(): String {
                return "Hard"
            }
        }
    }

    fun hasUser(user: String): Boolean {
        return users.contains(user)
    }

    fun addUser(user: String) {
        if (!hasUser(user))
            users.add(user)
    }

    fun removeUser(user: String) {
        users.remove(user)
    }

    fun getGameMode(): GameMode {
        return GameMode.values()[gameMode]
    }

    fun getDifficulty(): GameDifficulty {
        return GameDifficulty.values()[difficulty]
    }

    fun getAllUsers(): List<String> {
        return users
    }

    fun getRealUsers(): List<String> {
        return users.filter { username -> !ProfileManager.isVirtualPlayer(username) }.toList()
    }

    fun getVirtualUsers(): List<String> {
        return users.filter { username -> ProfileManager.isVirtualPlayer(username) }.toList()
    }
}