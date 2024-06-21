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
  - Updated the InventoryStash component to listen for click events on item images.
  - Implemented the equipItem method to handle equipping weapons and armor when clicked.
  - Dispatched the corresponding Vuex actions (equipWeapon or equipArmor) based on the item type.

- Implemented item information hover feature in InventoryStash component.
  - Added a new data property called hoveredItem to track the currently hovered item.
  - Implemented the showItemInfo and hideItemInfo methods to update the hoveredItem property when hovering over an item.
  - Created a new ItemInfo component to display the item information when an item is hovered.
  - Passed the hoveredItem data to the ItemInfo component as a prop.

- Refactored InventoryStash component to display weapons, armor, and aid items in a grid layout.
  - Updated the template structure to use a grid layout for displaying items.
  - Added separate sections for weapons, armor, and aid items.
  - Adjusted the styling to ensure proper spacing and alignment of items in the grid.

- Adjusted the positioning of the item information box to prevent it from being cut off inside the modal.
  - Modified the CSS styles for the ItemInfo component to use absolute positioning.
  - Calculated the position of the item information box based on the mouse position and modal dimensions.
  - Ensured that the item information box stays within the bounds of the modal.

- Fixed an issue where the QuestLog modal could not be closed by clicking on the icon again.
  - Added a toggleModal method to handle opening and closing the QuestLog modal.
  - Updated the template to bind the toggleModal method to the icon's click event.
  - Modified the openModal and closeModal methods to use the toggleModal method internally.

- Improved the smoothness of opening and closing the QuestLog modal to match the behavior of other modals.
  - Applied CSS transitions to the modal overlay and content elements.
  - Adjusted the transition duration and easing function to achieve a smooth opening and closing effect.

- Refactored the QuestLog component to use a toggleModal method for opening and closing the modal.
  - Replaced the separate openModal and closeModal methods with a single toggleModal method.
  - Updated the template and event bindings to use the toggleModal method consistently.

- Added a click event listener to the outer modal div in QuestLog to close the modal when clicking outside the modal content.
  - Wrapped the modal content inside an outer div with a class of "modal-outer".
  - Added a click event listener to the "modal-outer" div to close the modal when clicked.
  - Prevented the event from propagating to the modal content to avoid closing the modal when clicking inside the content area.

- Moved the confirmResetQuests method in QuestLog to be triggered by clicking on the modal footer element instead of the icon.
  - Created a new "modal-footer" element inside the QuestLog modal.
  - Moved the quest reset confirmation logic to the "modal-footer" element's click event.
  - Updated the styling of the modal footer to make it visually distinct and clickable.

- Updated the styling of the modal footer in QuestLog to improve readability and consistency.
  - Applied a background color and padding to the modal footer to make it stand out.
  - Used a contrasting text color for the footer text to ensure good readability.
  - Added hover and active styles to provide visual feedback when interacting with the footer.

- Fixed a bug where the quest progress was not updating correctly in the QuestDetails component.
  - Reviewed the quest progress update logic in the QuestDetails component.
  - Identified and fixed the issue causing the progress to update incorrectly.
  - Tested the quest progress functionality to ensure it now updates accurately.

- Optimized the performance of the MapComponent by reducing the frequency of marker updates.
  - Analyzed the existing marker update logic in the MapComponent.
  - Identified opportunities to optimize the marker updates and reduce unnecessary re-renders.
  - Implemented a debounce or throttle mechanism to limit the frequency of marker updates.
  - Tested the performance improvements and verified that the map remains responsive.

- Improved the responsiveness of the InventoryStash modal on smaller screen sizes.
  - Added media queries to adjust the layout and styling of the InventoryStash modal for smaller screens.
  - Reduced the font sizes and padding of elements to ensure they fit within the available space.
  - Tested the InventoryStash modal on various screen sizes to ensure a good user experience.

- Added error handling for failed API requests in the UserLogin component.
  - Implemented a try-catch block around the API request code in the UserLogin component.
  - Displayed appropriate error messages to the user when API requests fail.
  - Logged the error details in the console for debugging purposes.

- Implemented client-side validation for the character creation form in the CharacterCreation component.
  - Added validation rules for each form field in the CharacterCreation component.
  - Displayed validation error messages to the user when form fields are invalid.
  - Prevented form submission if any validation errors are present.

- Refactored the Vuex store to use modules for better organization and maintainability.
  - Restructured the Vuex store to use modules for different feature areas (e.g., characters, inventory, quests).
  - Moved related state, mutations, actions, and getters into their respective modules.
  - Updated the components to import and use the namespaced Vuex modules.

- Updated the project dependencies to their latest versions and resolved any compatibility issues.
  - Ran npm outdated to identify outdated project dependencies.
  - Updated each dependency to its latest compatible version.
  - Tested the application to ensure no breaking changes or compatibility issues arose from the updates.

- Performed code cleanup and removed unused components, methods, and styles throughout the project.
  - Conducted a thorough review of the codebase to identify unused or redundant code.
  - Removed unused components, methods, and styles to improve code quality and reduce clutter.
  - Verified that the removal of unused code did not introduce any new bugs or issues.

- Added comprehensive inline comments to complex parts of the codebase to improve code readability and maintainability.
  - Identified complex or non-intuitive sections of the codebase that would benefit from explanatory comments.
  - Added clear and concise inline comments to explain the purpose, functionality, and any important considerations for those code sections.
  - Ensured that the comments are up to date and accurately reflect the current state of the code.


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
