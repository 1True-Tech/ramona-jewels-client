import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = 'success' | 'error' | 'warning'

export interface ResponseModalState {
  isOpen: boolean
  type: ModalType
  title: string
  message: string
  errors?: Record<string, string[]>
  autoClose?: boolean
  autoCloseDelay?: number
}

export interface UIState {
  responseModal: ResponseModalState
}

const initialState: UIState = {
  responseModal: {
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
    errors: undefined,
    autoClose: false,
    autoCloseDelay: 3000,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showModal(
      state,
      action: PayloadAction<Partial<ResponseModalState> & Pick<ResponseModalState, 'type' | 'title' | 'message'>>
    ) {
      state.responseModal = {
        isOpen: true,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        errors: action.payload.errors,
        autoClose: action.payload.autoClose ?? (action.payload.type === 'success'),
        autoCloseDelay: action.payload.autoCloseDelay ?? 3000,
      }
    },
    hideModal(state) {
      state.responseModal.isOpen = false
    },
    setModal(state, action: PayloadAction<ResponseModalState>) {
      state.responseModal = action.payload
    },
  },
})

export const { showModal, hideModal, setModal } = uiSlice.actions
export default uiSlice.reducer