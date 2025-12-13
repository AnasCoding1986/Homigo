import PropTypes from 'prop-types'
import { createContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { app } from '../firebase/firebase.config'
import axios from 'axios'
export const AuthContext = createContext(null)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

 const createUser = async (email, password) => {
  setLoading(true)
  const result = await createUserWithEmailAndPassword(auth, email, password)
  setLoading(false)
  return result
}

const signIn = async (email, password) => {
  setLoading(true)
  const result = await signInWithEmailAndPassword(auth, email, password)
  setLoading(false)
  return result
}

const signInWithGoogle = async () => {
  setLoading(true)
  const result = await signInWithPopup(auth, googleProvider)
  setLoading(false)
  return result
}

const resetPassword = async (email) => {
  setLoading(true)
  const result = await sendPasswordResetEmail(auth, email)
  setLoading(false)
  return result
}

const logOut = async () => {
  setLoading(true)
  await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
    withCredentials: true,
  })
  const result = await signOut(auth)
  setLoading(false)
  return result
}

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    })
  }
  // Get token from server
  const getToken = async email => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/jwt`,
      { email },
      { withCredentials: true }
    )
    return data
  }

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      if (currentUser) {
        getToken(currentUser.email)
      }
      setLoading(false)
    })
    return () => {
      return unsubscribe()
    }
  }, [])

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  // Array of children.
  children: PropTypes.array,
}

export default AuthProvider
