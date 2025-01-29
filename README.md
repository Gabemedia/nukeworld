# NukeWorld

NukeWorld is a post-apocalyptic game built with Vue.js and Vuex. Players can embark on quests, earn rewards, and manage their inventory.

## Changelog

### Version 0.0.1 (29-02-2024)

- Initial commit
- Set up Vue.js project with Vue CLI
- Configured Vuex store
- Implemented basic components and routing

### Version 0.0.2 (29-02-2024)
- Added CharacterCreation component to allow players to create new characters
- Added GameWorld component to display the main game area
- Added UserLogin component to handle user authentication
- Updated Vue Store to handle Character Creation and User Login state

### Version 0.0.3 (04-03-2024)
- Added CharacterList component to display all created characters
- Implemented character selection to set active character
- Added Character leveling system to track XP and level
- Introduced money/currency system

### Version 0.0.4 (04-03-2024)
- Added quest system with progress tracking
- Implemented reward system for completed quests
- Implemented popup system for completed quests
- Implemented level system for completed quests


### Version 0.0.5 (05-03-2024)
- Code cleanup and refactoring
- Added offcanvas
- Added CharacterInfo component to display character details
- Added QuestLog component to track quest progress
- Implemented more quests with different objectives.

### Version 0.0.6 (06-03-2024)
- Added Toastify notifications for quest completions.
- Updated overall styling and UI.
- Refactored Character component to inherit from base Character class.
- Refactored ExpLvl component to inherit from base ExpLvl class.
- Refactored QuestLines component.

### Version 0.0.7 (16-05-2024)
- Integrated map component with quest markers
- Introduced inventory management system
- Fixed an issue where reward items were not added to the character's inventory

### Version 0.0.8 (19-05-2024)
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

### Version 0.0.9 (14-06-2024)
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

### Version 0.1.0 (15-06-2024)
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

### Version 0.1.1 (20-06-2024)
- Fixed quest claiming logic in QuestList and QuestDetails components.
- Added separators between items in the QuickBar dropdown menu.
- Resolved conflicts between the HealthBar and QuestDetails progress bars.
- Implemented dynamic marker updates based on quest state changes in MapComponent and MapComponent2.
- Added bouncing animation to markers for quests in the "ready-to-claim" state.
- Simplified the PlayerShop component's HTML structure for better maintainability.
- Fixed ESLint errors related to unused variables in MapComponent and MapComponent2.

### Version 0.1.2 (20-06-2024)
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

### Version 0.1.3.5 (22-06-2024)
- Added automatic initialization of quests at app startup
- Added display of quests with levelRequirement equal to or below the player's current level.
- Added resources system for character and story.
- Added resources to the player inventory.
- Added new Item 20 diffrent weapons.
- Added new Aid Big Medkid 
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
- Fixed an issue that made shop items cost 1.65% more.

### Version 0.1.4.0 (23-06-2024)
- Improved combat system implementation
- Added automatic attack function in battles
- Fixed a bug where random enemies were shown instead of specific enemies from stories
- Implemented correct opening of the combat system from storylines
- Improved logic for repeatable stories
- Added visual feedback for victory and rewards with confetti effect
- Optimized state management for enemies and battles
- Improved user interface for the battle modal
- Added error handling for missing enemies or weapons
- Fixed an issue where multiple settlement modals were appearing on top of each other.
- Refactored `SettlementModal.vue` to use separate modals for placement and confirmation.
- Updated `MapComponent.vue` and `MapComponent2.vue` to use the `openPlacementModal` method from `SettlementModal.vue`.
- Added settlement data display, deletion, and movement functionality to the settlement modal.
- Fixed a bug where quest markers were not clickable in `MapComponent2.vue`.
- Restored the `openModal` method in `MapComponent2.vue` to handle quest marker clicks.
- Refactored SettlementModal.vue to remove duplicate modals and improve user interface.
- Updated SideBar.vue to integrate SettlementModal more efficiently.
- Improved consistency in styling and layout of SettlementModal with other components like InventoryLog and PlayerShop.
- Optimized logic for placing and removing settlements.
- Fixed issues with overlapping modals in SettlementModal.
- Enhanced responsiveness and user experience when interacting with settlement functionality.

### Version 0.1.5 (28-06-2024)
- Added new maps
- Added Backend to control all items, quests, story etc.
- Added Game Security to Backend changes cant happen without new game build
- Added Screen Resolution Support 1024 - 1280 - 1366 - 1440 - 1600 - 1920 - 2K - 4K 
- Refactored Userlogin Component
- Refactored New Story Styling
- Refactored MapComponent
- Refactored MapComponent2
- Refactored SettlementModal
- Refactored InfomationBox
- Restyled Userlogin Process
- Restyled New Story Process
- Restyled MapComponent
- Restyled MapComponent2
- Restyled InfomationBox
- Reworked Settlement System
- Minor Bug Fixes
- Major Design overhaul
- Improved stability
- Fixed Settlement button issue


### Version 0.1.5.5 (30-06-2024)
- Added fullscreen mode to the GameWorld component
- Added methods to handle switching between normal view and fullscreen
- Updated CSS to support fullscreen display
- Improved responsiveness for different screen sizes in fullscreen mode
- Optimized scaling of UI elements in fullscreen mode
- Added event listeners to handle changes in fullscreen state
- Enhanced user experience by providing the option to maximize the game area
- Increased the size of map markers in MapComponent.vue for better visibility
- Adjusted quest markers to 36x48 pixels (20% larger than original)
- Updated settlement marker to 36x54 pixels to maintain proportions
- Fine-tuned marker anchor points to ensure correct placement on the map
- Removed MapComponent2.vue and consolidated map functionality into a single MapComponent
- Updated GameWorld.vue to use a single MapComponent with dynamic mapImageUrl based on player level
- Optimized codebase by removing unused methods and watches in GameWorld.vue
- Improved handling of map switching based on player level through computed properties
- Ensured preservation of all existing functionality and responsive design
- Simplified logic for displaying different maps based on player level
- Updated MapComponent.vue to display and handle quests in "in-progress" state
- Added new custom icon for "in-progress" quests on the map
- Modified filteredQuests computed property to include "in-progress" quests
- Updated getQuestIcon method to return the correct icon for "in-progress" quests
- Adjusted CSS to ensure consistent styling of all quest markers, including the new "in-progress" marker
- Improved responsiveness and scalability of quest markers across different screen sizes

### Version 0.1.6.0 (01-07-2024)
- Added new map
- Added new icons
- Refactored QuestLines
- Refactored ClaimRewards
- Fixed quest level filtering in MapComponent.vue to correctly display quests within the appropriate level range
- Updated quest filtering logic to only show quests.
- Ensured that quests below level 1 are never displayed
- Modified the filteredQuests computed property in MapComponent.vue to implement the new level range logic
- Updated QuestTabs.vue to use the same quest level filtering logic as MapComponent.vue
- Added a new filteredQuests computed property in to handle level-based quest filtering
- Modified the activeQuests computed property in to use the new filteredQuests for consistent quest display across all tabs
- Ensured that Available, Active, and Ready tabs only show quests within the correct level range
- Fixed quest reward system to allow players to receive weapon, armor, and resource rewards independently
- Updated `claimRewards` function in Vuex store to correctly handle multiple reward types
- Improved reward chance calculations for each reward type (weapon, armor, resource)
- Updated QuestDetails.vue and QuestList.vue components to display correct item icons in reward toasts
- Refactored reward claiming logic to use item names for icon file paths, improving consistency and reducing errors
- Fixed a bug where players couldn't receive both weapon and armor rewards from a single quest
- Optimized quest reward calculations to provide a fair distribution of rewards
- Resolved issues with quest reward display in toast notifications
- Ensured consistency in item icon display across QuestDetails, QuestList, PlayerShop, and InventoryStash components
- Improved code consistency and maintainability across components
- Improved code consistency and maintainability across quest-related components
- Enhanced user experience by providing a more balanced and level-appropriate quest selection
- Enhanced user experience by providing more accurate visual feedback for quest rewards
- Major fix to quest handling across game in multiple modals and components.

### Version 0.1.6.1 (02-07-2024)
- Updated MainMenu to include a "Delete All" button for clearing local storage
- Improved GameSettings with consistent styling and layout matching other components
- Added easy access to return to the main menu from GameSetting
- Enhanced UserLogin with a button to return to the main menu
- Improved CreditsRoll with better typography and graphical elements
- Ensured consistent styling across all components (MainMenu, UserLogin, GameSettings, CreditsRoll)
- Fixed issue where GameSettings was not displaying when accessed from MainMenu
- Improved overall user interface and user experience with consistent button styles and layouts
- Updated color scheme to maintain the post-apocalyptic theme across all components
- Ensured all components have proper navigation options to improve user flow
- Added confirmation dialog for the "Delete All" functionality to prevent accidental data loss

### Version 0.1.7.5 (22-01-2025)
- Added ESC key functionality to return to Main Menu from anywhere in the game
- Implemented global keyboard event handling in App.vue
- Added cleanup of event listeners when component unmounts
- Ensured ESC key only triggers navigation when not already on Main Menu
- Fixed LvlPopUp not showing up when leveling up
- Improved level-up rewards system using existing Vuex actions
- Added visual feedback for health increase on level up
- Centralized level-up popup handling in GameWorld.vue
- Enhanced popup UI with better visuals and animations
- Rebalanced level-up rewards for better game progression:
  - Reduced exp bonus from 10% to 0.05% of max exp
  - Reduced money reward from 100 to 1 per level
  - Reduced health gain from 50 to 10 per level
- Moved maxHealth increase handling from Vuex store to LvlPopUp component
- Fixed issue with double health gain on level up
- Added text-to-speech functionality for story dialogues:
  - Automatically reads NPC messages when story starts
  - Reads new messages after each player choice
  - Stops current speech if player makes the final choice
  - Added stop button to manually stop speech playback
  - Optimized speech timing to prevent overlapping messages
  - Integrated with existing story progression system
  - Uses browser's native Web Speech API for optimal performance


### Version 0.1.7.8 (29-01-2025)
- Improved mobile menu UI and functionality
- Optimized mobile menu layout
- Added responsive design improvements
- Improved "Back to Main Menu" button in GameSettings
- Refactored GameSettings
  - Added Story Templates
  - Added Quest Templates
  - Added Enemy Templates
  - Added Resources Templates

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
