"use client"

import { createContext } from "react"

type SessionContextType = {
  user?: {
    id: string
    name: string
    email: string
  },
  isAuthenticated: boolean
}


const sessionContext = createContext<SessionContextType>({user: undefined, isAuthenticated: false})

const SessionProvider = ({children}: {children: React.ReactNode}) => {
}
