import React, { useState } from "react"
import styles from "./ChatWidgets.module.css"

const ChatWidgets = () => {
  const [showFBChat, setShowFBChat] = useState(false)
  const [showZaloChat, setShowZaloChat] = useState(false)

  const enableFB = import.meta.env.VITE_ENABLE_FACEBOOK_CHAT === "true"
  const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID
  const zaloPhoneNumber = "84772993108" // Số điện thoại Zalo cá nhân (bỏ số 0 đầu)

  const handleFBClick = () => {
    setShowFBChat(!showFBChat)
    // Open Facebook Messenger in a new window/tab
    const messengerUrl = `https://www.facebook.com/messages/t/${pageId}`
    window.open(messengerUrl, "_blank", "width=500,height=700")
  }

  const handleZaloClick = () => {
    setShowZaloChat(!showZaloChat)
    // Open Zalo chat cá nhân in a new window/tab
    const zaloUrl = `https://zalo.me/${zaloPhoneNumber}`
    window.open(zaloUrl, "_blank", "width=500,height=700")
  }

  return (
    <div className={styles.chatWidgetsContainer}>
      {/* Facebook Chat Button */}
      {enableFB && pageId && (
        <button
          className={styles.chatButton}
          onClick={handleFBClick}
          title="Chat với Facebook"
          aria-label="Facebook Chat"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.icon}
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      )}

      {/* Zalo Chat Button (Cá nhân) */}
      {zaloPhoneNumber && (
        <button
          className={styles.chatButton}
          onClick={handleZaloClick}
          title="Chat với Zalo"
          aria-label="Zalo Chat"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.icon}
          >
            {/* Zalo Z icon */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 10h-4v4h-2v-4H5v-2h4V6h2v4h4v2z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ChatWidgets
