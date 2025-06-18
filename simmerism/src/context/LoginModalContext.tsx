// context/LoginModalContext.tsx
"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import LoginModal from "@/components/LoginModal"
import RegisterModal from "@/components/RegisterModal"
import ForgetPasswordModal from "@/components/ForgetPasswordModal"

export type ModalType = "login" | "register" | "forgot-password"

type LoginModalContextType = {
  modalType: ModalType | null
  openModal: (type: ModalType) => void
  closeModal: () => void
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined)

export const LoginModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType | null>(null)

  const openModal = (type: ModalType) => setModalType(type)
  const closeModal = () => setModalType(null)

  return (
    <LoginModalContext.Provider value={{ modalType, openModal, closeModal }}>
      {children}

      <LoginModal
        isOpen={modalType === "login"}
        onClose={closeModal}
        onSwitchToRegister={() => openModal("register")}
        onSwitchToForgotPassword={() => openModal("forgot-password")}
      />
      <RegisterModal
        isOpen={modalType === "register"}
        onClose={closeModal}
        onSwitchToLogin={() => openModal("login")}
      />
      <ForgetPasswordModal
        isOpen={modalType === "forgot-password"}
        onClose={closeModal}
        onSwitchToLogin={() => openModal("login")}
      />
    </LoginModalContext.Provider>
  )
}

export const useLoginModal = () => {
  const context = useContext(LoginModalContext)
  if (!context) throw new Error("useLoginModal must be used within LoginModalProvider")
  return context
}
