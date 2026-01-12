"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GenerateTab from "@/components/generate-tab"
import HistoryTab from "@/components/history-tab"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Wiki Quiz Generator</h1>
          <p className="text-slate-300">Generate intelligent quizzes from Wikipedia articles</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-700">
            <TabsTrigger value="generate" className="text-white">
              Generate Quiz
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <GenerateTab />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
