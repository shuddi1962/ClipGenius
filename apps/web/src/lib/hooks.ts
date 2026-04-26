'use client'

import { useState, useEffect } from 'react'

export interface Settings {
  aiProvider: string
  openrouterKey: string
  kieKey: string
  searchKey: string
  searchProvider: string
  selectedModel: string
  kieModel: string
  companyName: string
  niche: string
  location: string
  tone: string
  targetAudience: string
  products: string
  whatsapp: string
  website: string
  address: string
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('roshanal_settings')
      const openrouterKey = localStorage.getItem('roshanal_openrouter_key') || ''
      const kieKey = localStorage.getItem('roshanal_kie_key') || ''
      const searchKey = localStorage.getItem('roshanal_search_key') || ''
      const aiProvider = localStorage.getItem('roshanal_ai_provider') || 'openrouter'
      const selectedModel = localStorage.getItem('roshanal_model') || 'anthropic/claude-3.5-sonnet'
      const kieModel = localStorage.getItem('roshanal_kie_model') || 'kie/grok-2-1212'

      const defaultSettings: Settings = {
        aiProvider,
        openrouterKey,
        kieKey,
        searchKey,
        searchProvider: 'tavily',
        selectedModel,
        kieModel,
        companyName: 'Roshanal Infotech Limited',
        niche: 'Security Systems, Marine Equipment, Solar Installation',
        location: 'Port Harcourt, Rivers State, Nigeria',
        tone: 'Professional, trustworthy, solution-focused',
        targetAudience: 'Oil & gas companies, boat owners, homes, businesses, Niger Delta region',
        products: 'CCTV, Smart Locks, Car Trackers, Solar, Outboard Engines, Fiberglass Boats, Marine Accessories',
        whatsapp: '08109522432',
        website: 'www.roshanalinfotech.com',
        address: 'No 18A Rumuola/Rumuadaolu Road, Adjacent Rumuadaolu Town Hall, Port Harcourt, Rivers State'
      }

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsed, openrouterKey, kieKey, searchKey, aiProvider, selectedModel, kieModel })
        } catch {
          setSettings(defaultSettings)
        }
      } else {
        setSettings(defaultSettings)
      }
      setLoading(false)
    }

    loadSettings()
  }, [])

  return { settings, loading }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Server-side settings function for API routes
export function getSettings(): Settings {
  return {
    aiProvider: process.env.AI_PROVIDER || 'openrouter',
    openrouterKey: process.env.OPENROUTER_API_KEY || '',
    kieKey: process.env.KIE_API_KEY || '',
    searchKey: process.env.TAVILY_API_KEY || '',
    searchProvider: 'tavily',
    selectedModel: process.env.AI_MODEL || 'anthropic/claude-3.5-sonnet',
    kieModel: process.env.KIE_MODEL || 'kie/grok-2-1212',
    companyName: 'Roshanal Infotech Limited',
    niche: 'Security Systems, Marine Equipment, Solar Installation',
    location: 'Port Harcourt, Rivers State, Nigeria',
    tone: 'Professional, trustworthy, solution-focused',
    targetAudience: 'Oil & gas companies, boat owners, homes, businesses, Niger Delta region',
    products: 'CCTV, Smart Locks, Car Trackers, Solar, Outboard Engines, Fiberglass Boats, Marine Accessories',
    whatsapp: '08109522432',
    website: 'www.roshanalinfotech.com',
    address: 'No 18A Rumuola/Rumuadaolu Road, Adjacent Rumuadaolu Town Hall, Port Harcourt, Rivers State'
  }
}
