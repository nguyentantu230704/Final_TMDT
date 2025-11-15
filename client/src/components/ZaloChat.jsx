import React from "react"

const ZaloChat = () => {
  const enabled = import.meta.env.VITE_ENABLE_ZALO_CHAT === "true"
  const phoneNumber = "84772993108" // ← SỐ ĐIỆN THOẠI ZALO CÁ NHÂN (bỏ số 0 đầu)

  if (!enabled || !phoneNumber) return null

  return (
    <a 
      href={`https://zalo.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '30px',
        zIndex: 10000,
        background: '#0068ff',
        color: 'white',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,104,255,0.3)'
      }}
    >
      <img 
        src="/zalo-icon.png" 
        alt="Chat Zalo" 
        width="30" 
        height="30" 
      />
    </a>
  )
}

export default ZaloChat