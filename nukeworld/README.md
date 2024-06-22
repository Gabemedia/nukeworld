# NukeWorld

NukeWorld is a post-apocalyptic game built with Vue.js and Vuex. Players can embark on quests, earn rewards, and manage their inventory.

## Changelog

### Version 0.0.1 (2024-02-29)

- Initial commit
- Set up Vue.js project with Vue CLI
- Configured Vuex store
- Implemented basic components and routing

### Version 0.0.2 (2024-02-29)
- Added CharacterCreation component to allow players to create new characters
- Added GameWorld component to display the main game area
- Added UserLogin component to handle user authentication
- Updated Vue Store to handle Character Creation and User Login state

### Version 0.0.3 (2024-03-04)
- Added CharacterList component to display all created characters
- Implemented character selection to set active character
- Added Character leveling system to track XP and level
- Introduced money/currency system

### Version 0.0.4 (2024-03-04)
- Added quest system with progress tracking
- Implemented reward system for completed quests
- Implemented popup system for completed quests
- Implemented level system for completed quests


### Version 0.0.5 (2024-03-05)
- Code cleanup and refactoring
- Added offcanvas
- Added CharacterInfo component to display character details
- Added QuestLog component to track quest progress
- Implemented more quests with different objectives.

### Version 0.0.6 (2024-03-06)
- Added Toastify notifications for quest completions.
- Updated overall styling and UI.
- Refactored Character component to inherit from base Character class.
- Refactored ExpLvl component to inherit from base ExpLvl class.
- Refactored QuestLines component.

### Version 0.0.7 (2024-05-16)
- Integrated map component with quest markers
- Introduced inventory management system
- Fixed an issue where reward items were not added to the character's inventory

### Version 0.0.8 (2024-05-19)
- Added Loot Chance Roll on Quest Completion.
- Added equipment system for weapons/armor.
- Added Equipped Weapons Info to Character Details.
- Added Equipped Weapons Button Logic to handle equipping/unequipping weapons.
- Implemented barter to sell weapons/armor for currency.
- Refactored Quest Details to display more info.
- Refactored Quests Button Logic to handle multiple quests.
- Major refactor of state management to simplify code.
- Minor styling tweaks.
- Minor bug fixes.

### Version 0.0.9 (2024-06-14)
- Added Generated Quest Locations
- Added Quest Level Requirement
- Added Quest Reward Drop
- Added Leafet Marker & Custom icons
- Added Quest Better Details
- Refactored Quest Details to display more info
- Refactored Quests Button Logic to handle multiple quests
- Refactored Item Drop to include multiple item roll
- Refactored Inventory to display armor information.
- Refactored Modal & Popups.
- Toasts logic changed to display rewards and none reward drops.
- Toasts timers refactored to display quest status and rewards.
- Major Tweaks and Bug Fixes. (Alpha Stable Build)
- Minor styling tweaks to Toasts in QuestList & QuestDetails.

### Version 0.1.0 (2024-06-15)
- Added Refresh Quests for 2500 money.
- Added Battle System.
- Added Health for Player and Enemies.
- Added Game Over Screen.
- Added Quickbar to UI
- Added Hotbar with equipped weapons/armor.
- Refactored CharacterList
- Refactored Userlogin to login by click on character
- Refactored QuestList to display quests better.
- Refactored QuestDetails to display more info.
- Refactored Health Logics.
- Tweaked UI.
- Tweaked Mobile-friendly UI.

### Version 0.1.1 (2024-06-20)
- Fixed quest claiming logic in QuestList and QuestDetails components.
- Added separators between items in the QuickBar dropdown menu.
- Resolved conflicts between the HealthBar and QuestDetails progress bars.
- Implemented dynamic marker updates based on quest state changes in MapComponent and MapComponent2.
- Added bouncing animation to markers for quests in the "ready-to-claim" state.
- Simplified the PlayerShop component's HTML structure for better maintainability.
- Fixed ESLint errors related to unused variables in MapComponent and MapComponent2.

### Version 0.1.2 (2024-06-20)
- Added functionality to equip weapons and armor by clicking on the item image in InventoryStash.
- Implemented item information hover feature in InventoryStash component.
- Refactored InventoryStash component to display weapons, armor, and aid items in a grid layout.
- Adjusted the positioning of the item information box to prevent it from being cut off inside the modal.
- Fixed an issue where the QuestLog modal could not be closed by clicking on the icon again.
- Improved the smoothness of opening and closing the QuestLog modal to match the behavior of other modals.
- Refactored the QuestLog component to use a toggleModal method for opening and closing the modal.
- Added a click event listener to the outer modal div in QuestLog to close the modal when clicking outside the modal content.
- Moved the confirmResetQuests method in QuestLog to be triggered by clicking on the modal footer element instead of the icon.
- Updated the styling of the modal footer in QuestLog to improve readability and consistency.
- Fixed a bug where the quest progress was not updating correctly in the QuestDetails component.
- Optimized the performance of the MapComponent by reducing the frequency of marker updates.
- Improved the responsiveness of the InventoryStash modal on smaller screen sizes.
- Added error handling for failed API requests in the UserLogin component.
- Implemented client-side validation for the character creation form in the CharacterCreation component.
- Refactored the Vuex store to use modules for better organization and maintainability.
- Updated the project dependencies to their latest versions and resolved any compatibility issues.
- Performed code cleanup and removed unused components, methods, and styles throughout the project.
- Added comprehensive inline comments to complex parts of the codebase to improve code readability and maintainability.

### Version 0.1.3.5 (2024-06-22)
- Added automatic initialization of quests at app startup
- Added display of quests with levelRequirement equal to or below the player's current level.
- Added resources system for character and story.
- Added resources to the player inventory.
- Improved quest system to preserve all quest states when reloading the page
- Implemented `resetQuests` function to reset completed quests.
- Implemented level-based quest filtering in MapComponent and MapComponent2
- Optimized `handleQuest` and `startQuestProgress` actions for better handling of ongoing quests
- Implemented periodic reset of completed quests
- Improved state management for quests with better integration of localStorage
- Optimized quest progress tracking for more accurate updates
- Resolved issues with ESLint warnings related to unused state parameters
- Updated filteredQuests computed property to display quests based on player's level
- Optimized quest marker display on the map based on player's level and quest availability
- Enhanced gameplay experience by providing players access to quests that match their level or are easier
- Refactored Game Over to include resources and story.



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
