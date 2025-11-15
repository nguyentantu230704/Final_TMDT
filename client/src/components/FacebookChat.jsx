import React, { useEffect } from "react"

// Facebook Messenger Customer Chat component
// Requires Vite env variables (in .env):
// VITE_ENABLE_FACEBOOK_CHAT=true
// VITE_FACEBOOK_PAGE_ID=your_page_id
// VITE_FACEBOOK_APP_ID=your_app_id (optional)

const FacebookChat = () => {
	const enabled = import.meta.env.VITE_ENABLE_FACEBOOK_CHAT === "true"
	const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID
	const appId = import.meta.env.VITE_FACEBOOK_APP_ID

	useEffect(() => {
		if (!enabled || !pageId) return

		// don't inject SDK twice
		if (document.getElementById("facebook-jssdk")) return

		// fb-root (some setups require it)
		if (!document.getElementById("fb-root")) {
			const fbRoot = document.createElement("div")
			fbRoot.id = "fb-root"
			document.body.appendChild(fbRoot)
		}

		// init function (optional appId)
		window.fbAsyncInit = function () {
			try {
				window.FB.init({
					appId: appId || "",
					xfbml: true,
					version: "v16.0",
				})
			} catch (e) {
				// ignore init errors
			}
		}

		const script = document.createElement("script")
		script.id = "facebook-jssdk"
		// using locale vi_VN; change if needed
		script.src = `https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js`
		script.async = true
		script.onload = () => {
			console.log("[FacebookChat] SDK script loaded")
			// Try parse XFBML in case it didn't auto-render
			try {
				if (window.FB && window.FB.XFBML && typeof window.FB.XFBML.parse === "function") {
					window.FB.XFBML.parse()
					console.log("[FacebookChat] FB.XFBML.parse() called")
				}
			} catch (e) {
				console.warn("[FacebookChat] error calling FB.XFBML.parse", e)
			}
		}
		script.onerror = (e) => console.warn("[FacebookChat] SDK failed to load", e)
		document.body.appendChild(script)

		return () => {
			// keep SDK for session; no removal to avoid breaking other pages
		}
	}, [enabled, pageId, appId])

	if (!enabled || !pageId) return null

	// Render customerchat element. Facebook will replace it when SDK loads.
	return (
		<>
			<div id="fb-root"></div>
			<div
				className="fb-customerchat"
				attribution="setup_tool"
				page_id={pageId}
				logged_in_greeting="Chào bạn! Mình có thể giúp gì cho bạn?"
				logged_out_greeting="Chào bạn! Mình có thể giúp gì cho bạn?"
			></div>
			{/* Dev helper: console shows whether component mounted */}
			<script
				dangerouslySetInnerHTML={{
					__html: `console.log('[FacebookChat] component rendered (pageId: ${pageId})')`,
				}}
			/>
		</>
	)
}

export default FacebookChat

