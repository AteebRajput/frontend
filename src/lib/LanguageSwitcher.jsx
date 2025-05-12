"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Globe } from "lucide-react" // Assuming you have react-feather or similar icon library
import { useTranslation } from "react-i18next"

function LanguageSwitcher() {
  const [language, setLanguage] = useState("en")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const {i18n} = useTranslation()

  // Load saved language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    setIsOpen(false)
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang)
    // You would typically update your app's language context here
    // or dispatch a Redux action to update the language state
  }

  return (
    <div className="language-dropdown-container" ref={dropdownRef}>
      <button className="language-dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <span>{language === "en" ? "English" : "اردو"}</span>
        <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="language-dropdown-menu">
          <button
            className={`language-option ${language === "en" ? "active" : ""}`}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
          <button
            className={`language-option ${language === "ur" ? "active" : ""}`}
            onClick={() => changeLanguage("ur")}
          >
            اردو
          </button>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher

