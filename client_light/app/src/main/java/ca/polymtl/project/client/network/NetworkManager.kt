package ca.polymtl.project.client.network

import com.github.nkzawa.socketio.client.IO
import com.github.nkzawa.socketio.client.Socket
import com.google.gson.GsonBuilder
import com.squareup.okhttp.*
import java.io.IOException
import java.util.function.Consumer

class NetworkManager private constructor() {
    companion object {
        private const val SERVER_URI = "https://p3-server-v2.herokuapp.com"
        private val GSON = GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss z").create()

        fun <T> deserialize(str: String?, type: Class<T>): T {
            return GSON.fromJson(str, type)
        }

        fun serialize(obj: Any?): String {
            return GSON.toJson(obj)
        }
    }

    class Rest private constructor() {
        companion object {
            private val client: OkHttpClient = OkHttpClient()

            fun get(
                endpoint: String,
                headers: Map<String, String>?,
                successConsumer: Consumer<String>,
                failureConsumer: Consumer<Int> = Consumer {}
            ) {
                call(
                    "GET",
                    getFullUrl(endpoint),
                    payload = null,
                    headers = headers,
                    successConsumer = successConsumer,
                    failureConsumer = failureConsumer
                )
            }

            fun put(
                    endpoint: String,
                    payload: Any?,
                    headers: Map<String, String>?,
                    successConsumer: Consumer<String>,
                    failureConsumer: Consumer<Int> = Consumer {}
            ) {
                call(
                        "PUT",
                        getFullUrl(endpoint),
                        payload = payload,
                        headers = headers,
                        successConsumer = successConsumer,
                        failureConsumer = failureConsumer
                )
            }

            fun post(
                endpoint: String,
                payload: Any?,
                headers: Map<String, String>?,
                successConsumer: Consumer<String>,
                failureConsumer: Consumer<Int> = Consumer {}
            ) {
                call(
                    "POST",
                    getFullUrl(endpoint),
                    payload = payload,
                    headers = headers,
                    successConsumer = successConsumer,
                    failureConsumer = failureConsumer
                )
            }

            fun delete(
                endpoint: String,
                headers: Map<String, String>?,
                successConsumer: Consumer<String>,
                failureConsumer: Consumer<Int> = Consumer {}
            ) {
                call(
                    "DELETE",
                    getFullUrl(endpoint),
                    payload = null,
                    headers = headers,
                    successConsumer = successConsumer,
                    failureConsumer = failureConsumer
                )
            }

            private fun call(
                method: String,
                url: String,
                payload: Any?,
                headers: Map<String, String>?,
                successConsumer: Consumer<String>,
                failureConsumer: Consumer<Int>
            ) {
                var body: RequestBody? = null
                if (payload != null) {
                    val bodyStr: String = if (payload is String) {
                        payload
                    } else {
                        serialize(payload)
                    }
                    body = RequestBody.create(
                        MediaType.parse("application/json; charset=utf-8"),
                        bodyStr
                    )
                }

                val requestBuilder = Request.Builder().url(url).method(method, body)
                if (headers != null)
                    requestBuilder.headers(Headers.of(headers))

                client.newCall(requestBuilder.build()).enqueue(object : Callback {
                    override fun onFailure(request: Request?, e: IOException?) {
                        failureConsumer.accept(0)
                    }

                    override fun onResponse(response: Response?) {
                        if (response != null) {
                            when (response.code()) {
                                200 -> successConsumer.accept(response.body().string())
                                else -> failureConsumer.accept(response.code())
                            }
                        }
                    }
                })
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