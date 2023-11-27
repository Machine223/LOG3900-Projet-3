package ca.polymtl.project.client.light.network

import ca.polymtl.project.client.light.socket.CommunicationSerializer
import com.github.nkzawa.socketio.client.IO
import com.github.nkzawa.socketio.client.Socket
import com.squareup.okhttp.*

class NetworkManager private constructor() {
    companion object {
        private val SERVER_URI = "https://p3-server.herokuapp.com"
    }

    class Rest private constructor() {
        companion object {
            private val client: OkHttpClient = OkHttpClient()

            fun get(endpoint: String, headers: Map<String, String>?, callback: Callback?) {
                call("GET", getFullUrl(endpoint), payload = null, headers = headers, callback = callback)
            }

            fun post(endpoint: String, payload: Any?, headers: Map<String, String>?, callback: Callback?) {
                call("POST", getFullUrl(endpoint), payload = payload, headers = headers, callback = callback)
            }

            private fun call(method: String, url: String, payload: Any?, headers: Map<String, String>?, callback: Callback?) {
                var body: RequestBody? = null
                if (payload != null) {
                    val bodyStr: String = if (payload is String) {
                        payload
                    } else {
                        CommunicationSerializer.serialize(payload)
                    }
                    body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), bodyStr)
                }

                val requestBuilder = Request.Builder().url(url).method(method, body)
                if (headers != null)
                    requestBuilder.headers(Headers.of(headers))

                client.newCall(requestBuilder.build()).enqueue(callback)
            }

            private fun getFullUrl(endpoint: String): String {
                return String.format("%s/%s", SERVER_URI, endpoint.replace(Regex("^/"), ""))
            }
        }
    }

    class SocketIO private constructor() {
        companion object {
            fun create(token: String): Socket {
                val options = IO.Options()
                options.query = "username=$token"
                options.forceNew = true

                return IO.socket(SERVER_URI, options)
            }
        }
    }

}