package ca.polymtl.project.client.light.socket

import com.google.gson.GsonBuilder

class CommunicationSerializer private constructor() {
    companion object {
        private val GSON = GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss z").create()

        fun <T> deserialize(str: String?, type: Class<T>): T {
            return GSON.fromJson(str, type)
        }

        fun serialize(obj: Any?): String {
            return GSON.toJson(obj)
        }
    }
}