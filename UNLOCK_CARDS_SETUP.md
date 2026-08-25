# IELTSX Unlock Cards

Added:
- `assets/unlock-cards.css`
- `assets/unlock-cards.js`
- `auth-bridge.js`

Premium cards can use:
`data-premium-card`

The unlock UI preserves the existing card design and uses IELTSX accent `#820241`.

Premium status is determined from the logged-in email and the user's premium record. For production, the server should be the source of truth rather than localStorage.
