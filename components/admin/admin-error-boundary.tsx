"use client"

import React from "react"
import { Button } from "@/components/ui/button"

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminErrorFallbackProps {
  error?: Error
  resetError: () => void
}

export function AdminErrorFallback({ error, resetError }: AdminErrorFallbackProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg border shadow-sm">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Admin Panel Error
          </h3>
          <p className="text-gray-600">
            An error occurred in the admin panel. This might be due to authentication issues or a temporary problem.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
              <details className="text-sm text-red-700">
                <summary className="cursor-pointer font-medium mb-2">Technical Information</summary>
                <pre className="whitespace-pre-wrap break-words bg-red-100 p-3 rounded text-xs font-mono">
                  {error.message}
                  {error.stack && `\n\nStack trace:\n${error.stack}`}
                </pre>
              </details>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Check if you're properly logged in as an admin</li>
                <li>Verify your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="flex-1"
              >
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()} 
              className="w-full text-sm"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}