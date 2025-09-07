"use client"

import * as React from "react"
import type { ToasterProps, Action as ToasterAction } from "sonner"
import { store } from "@/store"
import { showModal } from "@/store/slices/uiSlice"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

// Define allowed variants
type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

type ToasterToast = ToasterProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToasterAction
  variant?: ToastVariant
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

type Toast = Omit<ToasterToast, "id">

// ✅ Variant → Tailwind style mapping
const variantClasses: Record<ToastVariant, string> = {
  default: "bg-gray-800 text-white",
  destructive: "bg-red-600 text-white",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
}

function toast({ variant = "default", ...props }: Toast) {
  const id = genId()

  // Map toast variants to modal types
  const variantToType: Record<string, 'success' | 'error' | 'warning'> = {
    default: 'warning',
    info: 'warning',
    warning: 'warning',
    success: 'success',
    destructive: 'error',
  }

  const type = variantToType[variant] ?? 'warning'
  const title = (props.title as string) || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice')
  const message = (props.description as string) || ''

  // Dispatch global modal instead of showing a toast
  store.dispatch(
    showModal({
      type,
      title,
      message,
    })
  )

  // Return a noop controller to avoid breaking callers
  const update = (_props: ToasterToast) => {}
  const dismiss = () => {}

  return { id, dismiss, update }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
