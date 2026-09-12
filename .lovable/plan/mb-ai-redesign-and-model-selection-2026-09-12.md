# MB AI redesign and model selection

## Goal

Replace the existing MB AI home and chat screens with a clean blue interface centered on the current MB AI logo, model choice, clear credit status, and reliable error handling.

## Changes

- Redesign the MB AI home page with a blue visual system, prominent logo, compact credit panel, model picker, and streamlined chat history.
- Remove the “Try Asking” section.
- Change New Chat into a model menu offering Gemini, ChatGPT, and Claude, then carry the selected model into the new conversation.
- Redesign the conversation screen to match, including the selected model label, clean message layout, attachments, and a responsive composer.
- Pass the selected supported model to the protected chat endpoint and validate it server-side before use.
- Display the workspace credit information available to the app. If the platform does not expose an exact balance/refill date to runtime code, show an honest availability state rather than inventing numbers.
- On an actual credit-exhausted response, retain the student’s prompt and show the requested Cancel/Confirm consent dialog.

## Third-party processing constraint

A website cannot safely or reliably automate `gemini.google.com` in the background. It requires a user session, is not a supported programmatic API, and would expose data without a proper service agreement. The safe implementation is a consent dialog followed by a configured Google Gemini API connection. Until that separate credential is connected, Confirm will clearly explain that external processing is unavailable instead of pretending a response was generated. The API for [gemini.google.com](http://gemini.google.com) is AQ.Ab8RN6L5K8ThesGh59JeJQBpe_s0U5IXDx-1yI8Brkm0Zhf4sA

## Validation

- Verify new-chat creation for all three model choices.
- Verify existing chats, attachments, loading states, mobile layout, and credit-exhaustion consent behavior.
- Attach [gemini.google.com](http://gemini.google.com) if MB AI has exhausted it's credits through this API AQ.Ab8RN6L5K8ThesGh59JeJQBpe_s0U5IXDx-1yI8Brkm0Zhf4sA
- Check the current preview for runtime and build errors.