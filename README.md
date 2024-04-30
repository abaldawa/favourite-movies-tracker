# Favorite movies tracking application

### Author: Abhijit Baldawa

A fullstack Node.js/React.js/Typescript/monorepo application to search and save favorite movies. Movies are pulled from OMDB public API's with an search as you type infinite scroll list.

### Tech Stack

1. **Backend:** Node.js (18.x or higher), Typescript, express.js, Winston
2. **Front end:** React.js, Typescript, Material UI (MUI), Zustand (state manager)
3. **Common libraries**: Zod (For end to end data validation), axios
4. **monorepo**: Yarn workspaces setup is used.

### Pre-requisites

1. Node.js v18.x (or higher) must be installed. This is also marked in `.node-version` and `package.json` files of individual workspaces.
2. `yarn` must be installed

### How to run the application:

1. `git clone https://github.com/abaldawa/favourite-movies-tracker.git`
2. `cd favourite-movies-tracker`
3. execute `yarn`
4. `cd workspaces/server`
5. `cp .env.example .env` (Basically create a `.env` file in the folder `workspace/server`)
6. Open `.env` file and add set `OMDB_API_KEY` environment variable to your OMDB api secret key.
7. Execute `yarn dev` from the root of the application (`favourite-movies-tracker`)
8. Go to `http://localhost:3000` to see the UI

### User interface

Below video demonstrates the functionality of the application

https://github.com/abaldawa/favourite-movies-tracker/assets/5449692/e78b031a-525b-486e-81e4-59ab6ac8260e

### A bit about implementation

1. End to end runtime data type safety is implemented using ZOD both on frontend and backend and all the validation errors are handled and shown to the user on UI in popup.
2. Monorepo is fully used to share as much data as possible between frontend and backend (ex. ZOD schemas, rest api's, error's etc.) and is the single source of truth.
3. The implemented code architecture and design patterns are fully scalable both on the backend and frontend such that adding new features/functionalities would be very easy in the future.
4. Scalable and central error handling is fully implemented to a granular level both on the backend and frontend.
5. Helpful comment and JSDOC documentation is added in the code base explaining the logic which makes the code easy to understand.
6. Appropriate naming conventions and scalable folder structure is used to better fit with the monorepo architecture.

### Edge cases handling

1. When the UI is loading the data then the Loader is shown on the UI
2. If the data loading fails for any reason then an error popup displaying the exact error is shown on the UI.
3. Zod is used for data validation and if the data is received in an incorrect format (both on the frontend and backend) then the exact validation error details popup is shown on the UI.
4. The data coming from OMDB Api's are also validated using ZOD on the server and any error is shown on the UI as a popup.
5. When searching for a movie "infinite search result fetch on scroll end" functionality is implemented (as also highlighted on the output gif) so as a user you can keep scrolling through all the search results infinitely in the searchbox itself.
