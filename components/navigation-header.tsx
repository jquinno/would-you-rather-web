"use client"

import Link from "next/link"
import { MoreVertical, Settings } from "lucide-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function NavigationHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1">
          {/* Left side - can add logo or title here if needed */}
        </div>

        <div className="flex items-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-gray-800 rounded-lg p-1 shadow-xl border border-gray-700 animate-in fade-in-0 zoom-in-95"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item asChild>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md cursor-pointer outline-none transition-colors duration-150"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  )
}

