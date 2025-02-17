## IFS Chat App
A chat application designed as a guide for Internal Family Systems (IFS) excercises. The app provides a session-based chat to explore different "parts" of oneself, without storing user data.

Features

- ✅ Chat-based IFS guide with daily exercises
- ✅ No data storage, chat resets on refresh
- ✅ Simple and intuitive UI
- ✅ Built with Svelte, Node.js, and TS

## Project Structure

This project is currently focused on the web version, with plans for a native app in the future.

- web/ → Contains the web-based application (start the server here).
- native/ → Placeholder for future native development.

## Developing (web)

- Navigate to the web directory with `cd web`
- Install dependencies with `npm install`
- Create a .env file and paste your `VITE_OPENAI_API_KEY` key

Start a development server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Contributing
Contributions are welcome! Feel free to submit issues or open pull requests.

License
This project is open-source under the MIT License.
