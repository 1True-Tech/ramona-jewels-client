"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"

interface ResponseModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
  errors?: Record<string, string[]>
  autoClose?: boolean
  autoCloseDelay?: number
}

export function ResponseModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  errors,
  autoClose = false,
  autoCloseDelay = 3000
}: ResponseModalProps) {
  React.useEffect(() => {
    if (isOpen && autoClose && type === 'success') {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, autoCloseDelay, type, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
    }
  }

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          title: 'text-green-900',
          message: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'text-red-900',
          message: 'text-red-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          title: 'text-yellow-900',
          message: 'text-yellow-700'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className={`bg-white rounded-lg border shadow-lg ${colors.border}`}>
              {/* Header */}
              <div className={`p-4 rounded-t-lg ${colors.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIcon()}
                    <h3 className={`font-semibold ${colors.title}`}>
                      {title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-3">
                <p className={`text-sm ${colors.message}`}>
                  {message}
                </p>
                
                {/* Validation Errors */}
                {errors && Object.keys(errors).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Validation Errors:</h4>
                    <div className="space-y-1">
                      {Object.entries(errors).map(([field, fieldErrors]) => (
                        <div key={field} className="text-xs">
                          <span className="font-medium capitalize text-gray-700">{field}:</span>
                          <ul className="list-disc list-inside ml-2 text-red-600">
                            {fieldErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 pt-0 flex justify-end">
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}