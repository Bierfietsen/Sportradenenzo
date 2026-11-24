# sportradenenzo NÙ met SQL en react


## Development

Requires Node 22.22 or newer.

- `npm install` and `npm install --prefix src/client`
- `npm start` runs the API server (port 3001) and the Vite dev server (port 3000, proxies `/api`)
- In `src/client`: `npm run lint` and `npm run build` (output goes to `build/client/build`, where the server serves it)

The client is React 19 + React Router 8 + Redux Toolkit, styled with Tailwind 4, built with Vite.
