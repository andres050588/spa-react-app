import Axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem")
      }
    }
    fetchData()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div className="list-group">
        {posts.map(post => {
          const date = new Date(post.createdDate)
          const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} `

          return (
            <a key={post._id} href="#" className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> <span className="text-muted small">on {dateFormated} </span>
            </a>
          )
        })}
      </div>
    </>
  )
}

export default ProfilePosts
