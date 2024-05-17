# NukeWorld

NukeWorld is a post-apocalyptic game built with Vue.js and Vuex. Players can embark on quests, earn rewards, and manage their inventory.

## Changelog

### Version 1.0.0 (2023-05-25)

- Initial release
- Implemented quest system with progress tracking
- Added reward system for completed quests
- Integrated map component with quest markers
- Implemented character creation and login
- Introduced inventory management system

### Version 1.0.1 (2023-05-26)

- Fixed an issue where reward items were not added to the character's inventory
- Updated the `claimRewards` action in the Vuex store to correctly update the `inventory` array
- Added the `updateCharacterInArray` mutation to update the character object in the `characters` array

## Getting Started

To get started with NukeWorld, follow these steps:

1. Clone the repository: git clone https://github.com/Gabemedia/nukeworld.git

2. Navigate to the project directory: cd nukeworld

3. Install the dependencies: npm install

4. Start the development server: npm run serve

5. Open your web browser and visit `http://localhost:8080` to see the application running.

## Project Structure

- `src/components`: Contains Vue components for the game UI
- `src/store`: Includes the Vuex store and related files
- `src/router`: Defines the Vue Router configuration
- `src/assets`: Stores static assets like images and icons
- `public`: Contains the HTML entry point and other public assets

## Dependencies

- Vue.js
- Vuex
- Vue Router
- Bootstrap
- Leaflet (for the map component)
- vue3-toastify (for notifications)

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
