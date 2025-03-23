"use client"
import { useEffect } from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Heart, Share2, Image, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Community() {
  const { communityPosts, friends, user, likePost, hydrateUserFromSupabase } = useEcoStore()
  useEffect(() => {
    hydrateUserFromSupabase()
  }, [])
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed")
  const [newPostContent, setNewPostContent] = useState("")

  const handleLikePost = (postId: string) => {
    likePost(postId)
  }

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return

    // In a real app, this would call an API to create a post
    alert(`Post submitted: ${newPostContent}`)
    setNewPostContent("")
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Community
          </CardTitle>
          <CardDescription>Connect with other eco-warriors and share your journey</CardDescription>
          <Tabs
            defaultValue="feed"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as "feed" | "friends")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {activeTab === "feed" ? (
              <motion.div
                key="feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your eco-friendly achievements..."
                          className="resize-none mb-2"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            Add Photo
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleSubmitPost}
                            disabled={!newPostContent.trim()}
                          >
                            <Send className="h-4 w-4" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={post.userAvatar} alt={post.userName} />
                              <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{post.userName}</h3>
                                <span className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
                              </div>
                              <p className="text-sm mt-1">{post.content}</p>
                              {post.image && (
                                <div className="mt-3 rounded-md overflow-hidden">
                                  <img
                                    src={post.image || "/placeholder.svg"}
                                    alt="Post attachment"
                                    className="w-full h-auto object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn("flex items-center gap-1 h-8", post.liked && "text-red-500")}
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <Heart className="h-4 w-4" fill={post.liked ? "currentColor" : "none"} />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="friends"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {friends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                  friend.status === "online" ? "bg-green-500" : "bg-gray-300",
                                )}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{friend.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Level {friend.level}</span>
                                <span>•</span>
                                <span>{friend.points} points</span>
                                <span>•</span>
                                <span>{friend.streak} day streak</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                friend.status === "online"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                              )}
                            >
                              {friend.status === "online"
                                ? "Online"
                                : "Last seen " + formatTimestamp(friend.lastActive)}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

