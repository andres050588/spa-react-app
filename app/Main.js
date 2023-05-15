import React, { useEffect, useReducer, useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"

// My components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"
import { useImmer, useImmerReducer } from "use-immer"
import Profile from "./components/Profile"

function MainComponent() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("ReactAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("ReactAppToken"),
      username: localStorage.getItem("ReactAppUsername"),
      avatar: localStorage.getItem("ReactAppAvatar")
    }
  }

  function appReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
    }
  }

  const [state, dispatch] = useImmerReducer(appReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("ReactAppToken", state.user.token)
      localStorage.setItem("ReactAppUsername", state.user.username)
      localStorage.setItem("ReactAppAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("ReactAppToken")
      localStorage.removeItem("ReactAppUsername")
      localStorage.removeItem("ReactAppAvatar")
    }
  }, [state.loggedIn])
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<MainComponent />)

if (module.hot) {
  module.hot.accept()
}
