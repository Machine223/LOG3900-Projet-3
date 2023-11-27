package ca.polymtl.project.client.light.message

import java.util.*

class ChatMessage(content: String, author: String, date: Date) {
    private val content = content
    private val author = author
    private val timestamp: Long = date.time

    fun getContent() = content
    fun getAuthor() = author
    fun getDate() = Date(timestamp)
}