"use client"

import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/context/hook"
import { createPortal } from "react-dom"

import { modalFor as MF, toggleModal } from "../context/theme"
import EditPassword from "./EditPassword"
import Invite from "./Invite"
import NewCollection from "./NewCollection"
import Signin from "./Signin"
import Signup from "./Signup"

const Modal = () => {
  const ref = useRef<Element | null>(null)
  const dispatch = useAppDispatch()
  const modalFor = useAppSelector(MF)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#modal")
    setMounted(true)
  }, [])

  return mounted && ref.current
    ? createPortal(
        <dialog className=" z-10">
          {modalFor === "signup" && <Signup onClick={() => dispatch(toggleModal({ showModal: false, modalType: "" }))} />}
          {modalFor === "signin" && (
            <Signin
            // onClick={() =>
            //   dispatch(toggleModal({ showModal: false, modalType: "" }))
            // }
            />
          )}
          {modalFor === "invite" && <Invite onClick={() => dispatch(toggleModal({ showModal: false, modalType: "" }))} />}
          {modalFor === "collection" && <NewCollection onClick={() => dispatch(toggleModal({ showModal: false, modalType: "" }))} />}
          {modalFor === "edit-password" && <EditPassword onClick={() => dispatch(toggleModal({ showModal: false, modalType: "" }))} />}
        </dialog>,
        ref.current
      )
    : null
}

export default Modal
