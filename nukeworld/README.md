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
- Added img property to aid items for proper icon display
- Added AidTemplates system with icon selector
- Enhanced GameSettings with Aid Templates support
- Fixed aid item structure to match the correct format:
  - Proper ID and UUID placement
  - Consistent object structure
  - Correct image property handling
- Improved template preview system for aid items
- Added visual icon selector for aid items
- Ensured proper data validation for aid items
- Added `img` property to all resources in `ressources.js`
- Updated `resourceTemplateData.js` with image support
- Added icon selector to `ResourceTemplates.vue` for choosing resource icons
- Added `img` property to all quests in `quests.js`
- Updated `questTemplateData.js` with quest background images
- Added background image selector to `QuestTemplates.vue` for choosing quest backgrounds
- Added `img` property to all weapons in `items.js`
- Created new `weaponTemplateData.js` with weapon templates and image support
- Created new `WeaponTemplates.vue` with weapon icon selector
- Updated `GameSettings.vue` to include WeaponTemplates
- Updated `QuickBar.vue` to use the new `img` property for weapons
- Updated `QuestDetails.vue` to use the new `img` property for weapons
- Updated `QuestDialog.vue` to use the new `img` property for weapons
- Updated `QuestList.vue` to use the new `img` property for weapons
- Updated `PlayerShop.vue` to use the new `img` property for weapons
- Updated `EnemyEncounters.vue` to use the new `img` property for weapons
- Updated `QuickBarRight.vue` to use the new `img` property for weapons
- Updated `InventoryStash.vue` to use the new `img` property for weapons

### Version 0.1.7.9 (30-01-2025)
- Added QuestDialog with text-to-speech functionality
- Improved voice synthesis implementation:
  - Added Karen as default voice across all browsers
  - Fixed Safari voice compatibility issues
  - Added synchronous voice loading for Safari
  - Improved voice selection logic to prioritize Karen
  - Added fallback to other English voices if Karen is unavailable
  - Fixed issue where default voice wasn't set on first load
  - Added voice debugging information to console
  - Optimized voice loading with 100ms delay for Safari compatibility
  - Improved voice settings persistence in localStorage
  - Added voice selection validation to prevent empty settings
  - Streamlined voice initialization process
  - Added error handling for voice synthesis
  - Improved voice consistency across components

### Version 0.1.8.0 (12-02-2025)

**ID & Template System:**
- Fixed issue with ID generation in GameSettings for new templates
- Fixed template handling in GameSettings.vue to ensure proper ID assignment
- Fixed ID placement in object creation to be consistent with existing data structure
- Fixed issue where template IDs were being overwritten by spread operator
- Fixed issue where some templates were using string IDs instead of numeric
- Fixed issue with ID generation in story and quest templates
- Ensured proper ID sequence when creating new items through templates
- Ensured proper ID generation sequence across all template types
- Ensured consistent ID format across all game data
- Updated template data structure in questTemplateData.js and storyTemplateData.js
- Updated all template handlers to follow consistent ID assignment pattern
- Added proper ID validation in getNextId method
- Improved logging for debugging template creation
- Improved error handling in template creation process

**Modal & UI Improvements:**
- Standardized modal styles across all components
- Updated modal header, body, and footer padding for consistency
- Updated button styles in modal footers
- Improved modal content layout and spacing
- Improved modal backdrop opacity and animation
- Improved modal close button positioning and styling
- Improved modal content organization and hierarchy
- Improved modal content padding and margin consistency
- Enhanced modal responsiveness on mobile devices
- Enhanced modal title styling and text shadow effects
- Enhanced modal accessibility with proper ARIA labels
- Added consistent border colors and styles to modals
- Added consistent hover effects for modal buttons
- Added consistent transition effects for modal animations
- Fixed modal scrolling issues on smaller screens
- Fixed modal stacking issues when multiple modals are open
- Fixed modal header alignment and title spacing

**Settlement & Radiation System:**
- Fixed settlement stats display and resource usage
- Fixed toast notifications in reduceRadiation to match game style
- Fixed resource icon display in settlement radiation toasts
- Updated settlement radiation reduction to use proper resource icons
- Improved settlement modal padding to 1rem
- Improved error handling for insufficient resources in radiation reduction
- Enhanced visual feedback when reducing settlement radiation
- Added proper toast styling for radiation reduction success/failure messages

**Level-Up & Progress System:**
- Fixed level-up popup styling to match other modals
- Enhanced level-up rewards display and animations 
- Added consistent progress bar styling across modals

### Version 0.1.8.1 (16-07-2025)
- Removed all automatic quest coordinate generation to ensure quest markers use static coordinates
- Fixed quest marker display by using only predefined coordinates from quests.js
- Removed random coordinate assignment in resetQuests and template creation
- Ensured quest coordinates remain consistent after quest reset or completion
- Improved map marker reliability by using only static quest locations
- Enhanced quest system stability by removing dynamic coordinate generation
- Fixed issue where quest markers would sometimes not appear on the map
- Optimized quest location handling for better performance
- Updated quest templates to preserve original quest coordinates
- Improved code maintainability by removing redundant coordinate generation logic
- Updated all quest coordinates to be within specific ranges:
- Optimized quest placement for better game balance and exploration
- Enhanced quest distribution across the game map
- Improved quest accessibility and discovery flow

### Version 0.1.8.2 (17-07-2025)
- Added user and developer sections in GameSettings
- Added music controls in user settings:
  - Music on/off toggle
  - Volume control slider
  - Settings persist in localStorage
- Improved music system in GameWorld:
  - Dynamic loading of all MP3 files from music folder
  - Random shuffle playlist
  - Automatic play next track
  - Error handling with fallback
  - Volume and on/off state sync with settings
- Fixed ESC key functionality to work with music controls
- Moved developer mode toggle to header section
- Improved settings layout and organization
- Enhanced user experience with better settings categorization
- Added proper error handling for audio playback
- Optimized music system performance
- Maintained all existing functionality while adding new features
- Updated all quest coordinates in quests.js to fit new map dimensions:
  - lon coordinates now range from 850-1250
  - lat coordinates now range from 3500
  - quest distribution across the game map for better exploration
- Optimized quest marker placement for improved accessibility
- Maintained all existing quest functionality while adapting to new coordinate ranges
- Improved quest accessibility and discovery flow

### Version 0.1.8.3 (18-07-2025)
- Modernized and unified UI styling across multiple components for consistent RPG experience
- Updated QuestTabs.vue and QuestDialog.vue to match modern styling used in PlayerShop.vue, InventoryLog.vue, and InventoryStash.vue
- Replaced old Bootstrap modal structure with modern modal layout in QuestLog.vue and StoryLog.vue
- Enhanced QuestDialog.vue with improved conversation layout and RPG-style visual elements
- Removed specific character names (Todd Wimsey) from dialog system while maintaining avatar icons and visual elements
- Added proper content wrappers and padding to prevent content from going to modal edges
- Improved mobile responsiveness and consistent spacing across all dialog components
- Enhanced visual feedback with hover effects, animations, and RPG-style elements
- Maintained all existing functionality including speech synthesis, resource checking, and story progression
- Fixed layout issues with "Reset Quests" button overflow in QuestLog.vue
- Optimized modal structure for better user experience and visual consistency
- Removed shop buttons from InventoryLog.vue and QuestLog.vue modal headers to simplify UI
- Cleaned up unused shop button methods and CSS styling from modal components
- Improved modal header layout by removing unnecessary shop button elements
- Streamlined modal controls to focus on essential functionality (close button and player money display)

### Version 0.1.8.4 (19-07-2025)
- Enhanced quest reward display system across all quest components:
  - Updated QuestDetails.vue, QuestTabs.vue, and QuestList.vue to show base values with green bonus indicators
  - Implemented consistent formatting for EXP, Money, Weapon, Armor, and Resource rewards
  - Added proper bonus calculation display with format "Base (+Bonus)" (e.g., "1360 (+510)")
  - Fixed weapon and armor reward chance formatting to show "15% (+1)" instead of "15 (+1)%"
  - Ensured base values are displayed in white and bonus values in green for clear visual distinction
  - Applied bonus calculations to all quest states including "ready-to-claim" quests
  - Used v-html directive to render styled bonus text with proper CSS classes
  - Added .bonus-indicator CSS class for consistent green bonus styling across all components
  - Improved quest reward readability and user experience with professional RPG-style formatting
  - Maintained all existing quest functionality while enhancing visual feedback
  - Optimized quest reward display for better game balance and player understanding

- Implemented comprehensive SPECIAL system bonuses for quest rewards:
  - Added Luck-based bonus calculations for weapon drop chances (2% per Luck point)
  - Added Luck-based bonus calculations for armor drop chances (1.5% per Luck point)
  - Added Luck-based bonus calculations for resource drop chances (2.5% per Luck point)
  - Integrated Intelligence bonuses for experience rewards (5% per Intelligence point)
  - Integrated Luck bonuses for money rewards (3% per Luck point)
  - Applied bonus calculations consistently across all quest components and states
  - Enhanced player progression by making SPECIAL stats directly impact quest rewards
  - Improved game balance by providing meaningful rewards for stat investment

- Enhanced quest reward display formatting and styling:
  - Fixed base value display to show original quest values from quests.js
  - Implemented proper bonus calculation display with green highlighting
  - Added consistent CSS styling for bonus indicators across all components
  - Improved visual feedback for players to understand their SPECIAL stat benefits
  - Enhanced quest reward readability with professional RPG-style formatting
  - Optimized quest reward display for better game balance and player understanding
  - Maintained all existing quest functionality while enhancing visual feedback

- Improved quest system user experience:
  - Enhanced quest reward visibility and clarity across all quest states
  - Added proper bonus calculations for "ready-to-claim" quests
  - Implemented consistent reward display formatting across QuestDetails, QuestTabs, and QuestList
  - Enhanced quest reward readability with professional styling
  - Optimized quest reward display for better game balance and player understanding
  - Maintained all existing quest functionality while enhancing visual feedback

### Version 0.1.8.5 (20-07-2025)

**Complete SPECIAL System Overhaul:**
- Redesigned SpecialManager.vue modal to match PlayerShop.vue, InventoryStash.vue, QuestLog.vue, QuestDetails.vue, SettlementBattle.vue, SettlementStats.vue, and SettlementModal.vue styling
- Added tabs system with SPECIAL stats and perks sections
- Implemented info panel instead of hover tooltips for better user experience
- Added detailed perk descriptions and upgrade/activation buttons
- Enhanced modal layout with proper header, body, and footer structure
- Improved visual consistency with other game modals

**Comprehensive Perks System Enhancement:**
- Created dedicated perks.js module for better code organization
- Added 42 functional perks with requirements and effects
- Implemented perk types: damage, health, shopDiscount, expBonus, dodge, moneyBonus
- Added utility functions for perk management and calculations
- Integrated perks system with Vuex store and SpecialManager.vue
- Balanced perks for level 1-50 progression system
- Removed non-functional perks and created working alternatives

**Battle System Redesign:**
- Redesigned BattleSystem.vue to match PlayerShop.vue style
- Added detailed combat stats display with player and enemy information
- Implemented battle log with 5-entry limit and scrolling functionality
- Enhanced battle modal with proper header, body, and footer structure
- Integrated SPECIAL bonuses into combat calculations
- Preserved all existing battle logic while improving UI
- Added action buttons and improved visual feedback

**Quest System & Map Improvements:**
- Removed all automatic quest coordinate generation to ensure quest markers use static coordinates
- Fixed quest marker display by using only predefined coordinates from quests.js
- Removed random coordinate assignment in resetQuests and template creation
- Ensured quest coordinates remain consistent after quest reset or completion
- Improved map marker reliability by using only static quest locations
- Enhanced quest system stability by removing dynamic coordinate generation
- Fixed issue where quest markers would sometimes not appear on the map
- Optimized quest location handling for better performance
- Updated quest templates to preserve original quest coordinates
- Improved code maintainability by removing redundant coordinate generation logic
- Updated all quest coordinates to be within specific ranges for better game balance
- Optimized quest placement for better game balance and exploration
- Enhanced quest distribution across the game map
- Improved quest accessibility and discovery flow

**Music System & Settings:**
- Added user and developer sections in GameSettings
- Added music controls in user settings with music on/off toggle and volume control slider
- Implemented settings persistence in localStorage
- Improved music system in GameWorld with dynamic loading of all MP3 files from music folder
- Added random shuffle playlist and automatic play next track functionality
- Implemented error handling with fallback for audio playback
- Added volume and on/off state sync with settings
- Fixed ESC key functionality to work with music controls
- Moved developer mode toggle to header section
- Improved settings layout and organization
- Enhanced user experience with better settings categorization
- Optimized music system performance
- Maintained all existing functionality while adding new features

**UI Modernization & Styling:**
- Modernized and unified UI styling across multiple components for consistent RPG experience
- Updated QuestTabs.vue and QuestDialog.vue to match modern styling used in PlayerShop.vue, InventoryLog.vue, and InventoryStash.vue
- Replaced old Bootstrap modal structure with modern modal layout in QuestLog.vue and StoryLog.vue
- Enhanced QuestDialog.vue with improved conversation layout and RPG-style visual elements
- Removed specific character names from dialog system while maintaining avatar icons and visual elements
- Added proper content wrappers and padding to prevent content from going to modal edges
- Improved mobile responsiveness and consistent spacing across all dialog components
- Enhanced visual feedback with hover effects, animations, and RPG-style elements
- Maintained all existing functionality including speech synthesis, resource checking, and story progression
- Fixed layout issues with "Reset Quests" button overflow in QuestLog.vue
- Optimized modal structure for better user experience and visual consistency
- Removed shop buttons from InventoryLog.vue and QuestLog.vue modal headers to simplify UI
- Cleaned up unused shop button methods and CSS styling from modal components
- Improved modal header layout by removing unnecessary shop button elements
- Streamlined modal controls to focus on essential functionality

**Quest Reward System Enhancements:**
- Enhanced quest reward display system across all quest components
- Updated QuestDetails.vue, QuestTabs.vue, and QuestList.vue to show base values with green bonus indicators
- Implemented consistent formatting for EXP, Money, Weapon, Armor, and Resource rewards
- Added proper bonus calculation display with format "Base (+Bonus)" (e.g., "1360 (+510)")
- Fixed weapon and armor reward chance formatting to show "15% (+1)" instead of "15 (+1)%"
- Ensured base values are displayed in white and bonus values in green for clear visual distinction
- Applied bonus calculations to all quest states including "ready-to-claim" quests
- Used v-html directive to render styled bonus text with proper CSS classes
- Added .bonus-indicator CSS class for consistent green bonus styling across all components
- Improved quest reward readability and user experience with professional RPG-style formatting
- Optimized quest reward display for better game balance and player understanding

**SPECIAL System Integration:**
- Implemented comprehensive SPECIAL system bonuses for quest rewards
- Added Luck-based bonus calculations for weapon drop chances (2% per Luck point)
- Added Luck-based bonus calculations for armor drop chances (1.5% per Luck point)
- Added Luck-based bonus calculations for resource drop chances (2.5% per Luck point)
- Integrated Intelligence bonuses for experience rewards (5% per Intelligence point)
- Integrated Luck bonuses for money rewards (3% per Luck point)
- Applied bonus calculations consistently across all quest components and states
- Enhanced player progression by making SPECIAL stats directly impact quest rewards
- Improved game balance by providing meaningful rewards for stat investment
- Enhanced quest reward display formatting and styling
- Fixed base value display to show original quest values from quests.js
- Implemented proper bonus calculation display with green highlighting
- Added consistent CSS styling for bonus indicators across all components
- Improved visual feedback for players to understand their SPECIAL stat benefits
- Enhanced quest reward readability with professional RPG-style formatting
- Optimized quest reward display for better game balance and player understanding
- Maintained all existing quest functionality while enhancing visual feedback

**Enemy and Quest Balancing:**
- Rebalanced enemies for level 1-50 progression system
- Added more enemies for early and mid-game progression
- Rebalanced quests for level 1-50 progression with balanced EXP and money rewards
- Updated quest reward chances and dynamic coordinates
- Enhanced quest distribution across the game map
- Improved quest accessibility and discovery flow

**Settlement System Enhancements:**
- Updated SettlementModal.vue and SideBar.vue to use dynamic resource costs from Vuex store
- Implemented dynamic resource cost display reflecting values from the store
- Enhanced settlement placement with proper resource validation
- Improved settlement modal styling to match other game modals
- Added proper error handling for insufficient resources

**Character Info Modal Redesign:**
- Redesigned QuickBarLeft.vue character info modal to match PlayerShop.vue style
- Added tabs for stats, combat, equipment, perks, and SPECIAL sections
- Enhanced character information display with detailed stats
- Improved modal layout and user experience
- Added proper navigation and information hierarchy

**UI/UX Improvements:**
- Fixed modal visibility and stacking context issues by teleporting modals to body
- Enhanced battle log with proper scrolling and entry limits
- Improved quest reward readability with professional RPG-style formatting
- Optimized quest reward display for better game balance and player understanding
- Maintained all existing functionality while enhancing visual feedback
- Fixed ESLint errors and improved code consistency

**Code Organization and Maintenance:**
- Created dedicated perks.js module for better code organization
- Updated Vuex store to delegate perk calculations and getters to perks.js
- Improved code consistency and maintainability across components
- Enhanced error handling and debugging capabilities
- Optimized performance and reduced code duplication

**Map Coordinate Updates:**
- Updated all quest coordinates in quests.js to fit new map dimensions
- Adjusted lon coordinates to range from 850-1250
- Adjusted lat coordinates to range from 3500
- Optimized quest distribution across the game map for better exploration
- Improved quest marker placement for improved accessibility
- Maintained all existing quest functionality while adapting to new coordinate ranges
- Enhanced quest accessibility and discovery flow

### Version 0.1.9.0 (25-07-2025)

**New Survival in the Wasteland Feature:**
- Added comprehensive "Survival in the Wasteland" game feature with modal interface
- Implemented stake-based progression system where players risk Nuka Coins and resources
- Added dynamic reward scaling based on days survived and initial stake
- Created SavageWastelandModal.vue component with modern UI matching PlayerShop.vue design
- Implemented resource grid selection with direct steppers (no popups)
- Added reward preview system showing expected Gold, EXP, and resource chances
- Integrated with existing BattleSystem.vue for enemy encounters
- Added random enemy encounter system with 15% chance per day
- Implemented flee mechanics with 80% reward loss penalty
- Added comprehensive toast notification system for all survival events

**Vuex State Management Integration:**
- Added savageWasteland state object to manage survival run data
- Implemented mutations: startSavage, continueSavage, savageEncounterEnemy, savageClearEnemyEncounter, savageFlee, claimSavageRewards, resetSavage
- Added actions: startSavageWithStake, continueSavage, handleSavageEnemy, savageBattleVictory, fleeSavage, claimSavageRewards
- Integrated with existing decreaseMoney action for Nuka Coins deduction
- Added random resource drops (3% chance per day) and chance-based return of staked resources (5% per resource, max 100%)
- Ensured proper state reset after flee/claim to prevent multiple claims

**UI/UX Enhancements:**
- Designed modal layout matching existing game components (PlayerShop, QuestDialog, QuestTabs)
- Added progress bar showing days survived with visual feedback
- Implemented reward display grid showing current Gold, EXP, and resources
- Added enemy encounter warning with fight/flee options
- Created stake selection interface with Gold steppers (min 500, max player's gold)
- Added resource selection grid with player amounts and stake steppers
- Implemented reward preview showing expected returns and resource chances
- Added proper modal header, body, and footer structure with consistent styling

**Battle System Integration:**
- Integrated with existing BattleSystem.vue for enemy encounters
- Added flee-battle event handling from BattleSystem to GameWorld
- Implemented proper battle victory handling with reward distribution
- Added flee reward calculation (20% of current rewards)
- Ensured enemy encounters disappear after victory or flee
- Fixed battle damage calculation to ensure minimum 10% of attack damage

**Toast Notification System:**
- Added comprehensive toast notifications for all survival events
- Implemented start survival toast with stake information
- Added continue progression toast with daily rewards
- Created battle victory toast with earned rewards
- Added flee toast showing 20% of rewards kept
- Implemented claim rewards toast with final reward summary
- Ensured consistent toast styling matching existing game notifications
- Fixed duplicate toast issues and centralized toast display logic

**Game Logic & Progression:**
- Implemented day-based progression with increasing rewards
- Added dynamic reward scaling: Gold = (20 + days * 15) * goldMultiplier
- Added dynamic EXP scaling: (15 + days * 10) * goldMultiplier + resourceBonus
- Implemented resource stake system with 5% chance per resource amount
- Added random resource drops during survival progression
- Created proper game state management preventing multiple claims
- Ensured Nuka Coins and resources are correctly deducted from player inventory
- Added proper flee reward calculation and distribution

**Sidebar Integration:**
- Added new sidebar button for Survival in the Wasteland feature
- Integrated with existing SideBar.vue component
- Used encounter.png icon for consistency with game theme
- Added proper modal opening/closing functionality

**Modal Scroll Improvements:**
- Fixed modal content overflow issues by adding scrollable containers
- Added max-height and overflow-y: auto to .tab-content in QuickBarLeft.vue character modal
- Ensured S.P.E.C.I.A.L. Stats and Bonus Modifiers sections never exceed modal boundaries
- Implemented proper scrolling for long content in character info modal
- Enhanced user experience by preventing modal content from breaking layout
- Maintained all existing functionality while improving modal usability

**Settlement System Enhancements:**
- Added cost display section to Settlement Level upgrade card in SettlementStats.vue
- Implemented resource cost preview showing Wood Scrap, Steel Scrap, and Money requirements
- Enhanced settlement upgrade interface to match other management cards (Population, Defense, Power)
- Added proper resource icon display for cost requirements
- Improved user experience by showing upgrade costs before attempting upgrade
- Prevented failed upgrade attempts by displaying requirements upfront
- Maintained consistent styling with other settlement management cards

**Code Organization & Maintenance:**
- Created modular component structure following existing patterns
- Implemented proper prop passing and event emission
- Added comprehensive error handling and state validation
- Ensured consistent naming conventions (SavageWastelandModal)
- Added detailed code comments for maintainability
- Fixed ESLint errors and improved code consistency
- Maintained all existing functionality while adding new features

**Bug Fixes & Improvements:**
- Fixed enemy damage calculation to ensure realistic combat
- Resolved flee reward display inconsistencies
- Fixed duplicate toast notifications
- Ensured proper state reset after flee/claim operations
- Fixed Nuka Coins deduction when starting survival run
- Resolved enemy encounter persistence issues
- Fixed battle completion logic and reward distribution
- Improved toast reward amount display accuracy
- Fixed modal content overflow issues in character info modal
- Resolved settlement upgrade cost display issues
- Enhanced modal scrolling behavior for better user experience

**Story System Enhancements:**
- Added comprehensive dialogue-based quest system (Story-system) for NukeWorld game
- Created 67 story quests spanning levels 2-50 with balanced progression
- Implemented StoryLines (main stories) and Steps (dialogue steps) structure
- Added player choice system with multiple dialogue options and consequences
- Integrated resource requirements and automatic resource checking/removal
- Implemented enemy battle integration with `startEnemyBattle` action
- Added reward system with EXP, money, resources, weapons, armor, and aid items
- Created reward mechanisms: `alwaysGiveReward` (boolean), `giveReward` (per option), and SPECIAL system bonuses
- Integrated Intelligence bonuses for EXP (5% per Intelligence point) and Luck bonuses for Money (3% per Luck point)
- Added enemy battle integration with `requiredEnemyDefeat` (enemy ID and count)
- Implemented story progression
- Created Vuex store integration for character, quests, storylines, inventory, and game settings
- Added speech synthesis integration for NPC messages
- Implemented story battle reward system to prevent double rewards
- Fixed "Claim Rewards" button to show comprehensive story rewards for story battles
- Corrected resource ID validation to ensure all required resources exist in game data
- Added balanced weapon rewards including firearms for levels 4-12 (Pistol, 10mm Pistol, Bow, Revolver, Hunting Rifle, Shotgun)
- Maintained game balance by avoiding high-tier weapons in early game stories
- Implemented comprehensive reward balancing across EXP, money, items, armor, aid, and resources
- Created diverse story themes including scavenging, settlement building, mutant threats, raider conflicts, and survival challenges
- Added proper error handling and data integrity checks for story system
- Enhanced user experience with clear dialogue progression and meaningful choices
- Optimized story system performance and maintainability
- Resolved flee reward display inconsistencies
- Fixed duplicate toast notifications
- Ensured proper state reset after flee/claim operations
- Fixed Nuka Coins deduction when starting survival run
- Resolved enemy encounter persistence issues
- Fixed battle completion logic and reward distribution
- Improved toast reward amount display accuracy
- Fixed modal content overflow issues in character info modal
- Resolved settlement upgrade cost display issues
- Enhanced modal scrolling behavior for better user experience


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
