'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, ArrowLeft, Send, Clock, CheckCheck, X } from 'lucide-react'
import { useEffect, useState, useRef, Suspense } from 'react'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  subject: string
  content: string
  sessionId?: string
  isRead: boolean
  createdAt: string
}

interface Conversation {
  conversationId: string
  tutorId: string
  tutorName: string
  studentId: string
  studentName: string
  lastMessage: {
    content: string
    createdAt: string
    isFromMe: boolean
  }
  unreadCount: number
}

interface Tutor {
  id: string
  name: string
}

const MASTER_TUTOR_EMAIL = 'romamuenchen@gmail.com'

function MessagesContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedConvId = searchParams.get('conversationId')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedConvId)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedTutorId, setSelectedTutorId] = useState<string>('')
  const [availableTutors, setAvailableTutors] = useState<Tutor[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isMasterTutor = session?.user?.email === MASTER_TUTOR_EMAIL

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selecting the conversation
    
    if (!confirm('Diese Konversation ausblenden? (Sie wird nur f�r dich verborgen)')) {
      return
    }

    try {
      const response = await fetch('/api/messages/hide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      })

      if (response.ok) {
        // Remove from local state
        setConversations(prev => prev.filter(c => c.conversationId !== conversationId))
        if (selectedConversation === conversationId) {
          setSelectedConversation(null)
        }
      } else {
        alert('Fehler beim Ausblenden der Konversation')
      }
    } catch (error) {
      console.error('Error hiding conversation:', error)
      alert('Fehler beim Ausblenden der Konversation')
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (session) {
      loadConversations()
    }
  }, [session])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
      markAsRead(selectedConversation)
      
      // Set up polling for real-time updates (every 3 seconds)
      const interval = setInterval(() => {
        loadMessages(selectedConversation)
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      const url = isMasterTutor ? '/api/messages?masterView=true' : '/api/messages'
      const response = await fetch(url)
      const data = await response.json()
      setConversations(data.conversations || [])
      
      // Extract unique tutors for master tutor dropdown
      if (isMasterTutor && data.conversations) {
        const tutors = new Map<string, string>()
        data.conversations.forEach((conv: Conversation) => {
          tutors.set(conv.tutorId, conv.tutorName)
        })
        const tutorList = Array.from(tutors.entries()).map(([id, name]) => ({ id, name }))
        setAvailableTutors(tutorList)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      })
      loadConversations()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    // Master tutor must select a tutor to reply as
    if (isMasterTutor && !selectedTutorId) {
      alert('Bitte w�hle einen Tutor aus, als der du antworten m�chtest')
      return
    }

    setSending(true)
    try {
      const conv = conversations.find(c => c.conversationId === selectedConversation)
      if (!conv) return

      // For master tutor, use selected tutor; for regular users, use their own data
      const replyAsTutorId = isMasterTutor ? selectedTutorId : conv.tutorId
      const replyAsTutorName = isMasterTutor 
        ? availableTutors.find(t => t.id === selectedTutorId)?.name || 'Tutor'
        : conv.tutorName

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          recipientId: isMasterTutor ? conv.studentId : conv.tutorId,
          recipientName: isMasterTutor ? conv.studentName : conv.tutorName,
          subject: 'Antwort',
          message: newMessage,
          sessionId: null,
          masterTutorOverride: isMasterTutor ? {
            sendAsId: replyAsTutorId,
            sendAsName: replyAsTutorName
          } : undefined
        })
      })

      if (response.ok) {
        setNewMessage('')
        loadMessages(selectedConversation)
        loadConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Fehler beim Senden der Nachricht')
    } finally {
      setSending(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const selectedConv = conversations.find(c => c.conversationId === selectedConversation)
  const userId = session.user.id || session.user.email!

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-premium py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <ArrowLeft className="w-6 h-6 text-navy-600" />
              <span className="font-semibold text-navy-900">Zur�ck zum Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-navy-900">Nachrichten</h1>
              {isMasterTutor && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  ?? MASTER TUTOR
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-premium py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-navy-900">Konversationen</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Keine Nachrichten</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {conversations.map(conv => (
                    <div
                      key={conv.conversationId}
                      className={`relative group ${
                        selectedConversation === conv.conversationId ? 'bg-purple-50' : ''
                      }`}
                    >
                      <button
                        onClick={() => setSelectedConversation(conv.conversationId)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 pr-8">
                            <h3 className="font-semibold text-navy-900 text-sm">
                              {isMasterTutor ? `${conv.studentName} ? ${conv.tutorName}` : conv.tutorName}
                            </h3>
                            {isMasterTutor && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Tutor: {conv.tutorName}
                              </p>
                            )}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                          {conv.lastMessage.isFromMe && 'Du: '}
                          {conv.lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(conv.lastMessage.createdAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </button>
                      <button
                        onClick={(e) => handleDeleteConversation(conv.conversationId, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-gray-200"
                        title="Konversation ausblenden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {selectedConversation && selectedConv ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-navy-900">{selectedConv.tutorName}</h2>
                  <p className="text-sm text-gray-600">Tutor</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => {
                    const isFromMe = msg.senderId === userId
                    return (
                      <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isFromMe ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                          {msg.subject && (
                            <p className={`text-xs font-semibold mb-1 ${isFromMe ? 'text-purple-100' : 'text-gray-500'}`}>
                              {msg.subject}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p className={`text-xs ${isFromMe ? 'text-purple-100' : 'text-gray-500'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {isFromMe && (
                              msg.isRead ? (
                                <CheckCheck className="w-3 h-3 text-purple-100" />
                              ) : (
                                <Clock className="w-3 h-3 text-purple-100" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200">
                  {isMasterTutor && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Antworten als:
                      </label>
                      <select
                        value={selectedTutorId}
                        onChange={(e) => setSelectedTutorId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-yellow-50"
                      >
                        <option value="">-- Tutor ausw�hlen --</option>
                        {availableTutors.map(tutor => (
                          <option key={tutor.id} value={tutor.id}>
                            {tutor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Nachricht schreiben..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Senden
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">W�hle eine Konversation</h3>
                  <p className="text-gray-600">Klicke auf eine Konversation, um die Nachrichten zu sehen</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Nachrichten werden geladen...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}

