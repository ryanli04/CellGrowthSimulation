# About the Project

The Cell Growth Simulation project is a React application that simulates the growth of bacterial cells on a grid representing a petri dish. The application provides a visual representation of cell growth according to specific rules and allows user interaction for placing and removing cells. Key features include:

* Grid representation of a petri dish (20x20 by default, adjustable)
* Cells divide every fixed time interval if adjacent empty cells are available
* User controls to start/pause/reset the simulation and adjust the growth interval and grid size
* Visualization of growth history over time
* Accessibility features like keyboard navigation and screen reader compatibility

## Features

__Grid Representation:__ Display a grid where each cell can be empty or occupied by a bacterial cell.

__Growth Rules:__ Cells divide at set intervals and require adjacent empty cells to divide.

__User Controls:__ Buttons to start/pause/reset the simulation and input fields to set the growth interval and grid size.

__Manual Cell Placement:__ Users can manually place or remove cells by clicking on the grid.

__Growth History:__ Visualize the growth rate of the colony over time.

__Dynamic Grid Size:__ Adjust the grid size dynamically.

__Accessibility:__ Features such as keyboard navigation and screen reader compatibility.

## Setup and Run the Project Locally

 __1.__ Clone the Repository
 ```console
 git clone https://https://github.com/ryanli04/CellGrowthSimulation.git
 cd cell-growth-simulation
 ```

 __2.__ Install Dependencies
 
 Make sure you have Node.js installed. Then, install the project      dependencies:
 ```console
 npm install
 ```

 __3.__ Run the Application
 ```console
 npm start
 ```
## Project Structure

```console
cell-growth-simulation/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── CellGrowthSimulation.tsx
│   ├── utils/
│   │   └── CellGrowth.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── index.css
│   └── App.css
├── package.json
├── README.md
└── tsconfig.json
```

### Key components
* __CellGrowthSimulation.tsx:__ The main component managing the state and rendering the grid, controls, and growth history.
* __CellGrowth.ts:__ Utility functions including the `getNextGeneration` function that applies the growth rules to generate the next state of the grid.
* __App.tsx:__ Root component that renders the `CellGrowthSimulation` component.
* __index.tsx:__ Entry point of the application.
* __App.css:__ CSS file for styling.

## Assumptions and Additional Features
### Assumptions
* The grid is square, with the same number of rows and columns.
* Cells divide every fixed time interval, provided there's an adjacent empty cell.
* The simulation stops and the growth history is no longer updated once the grid is fully occupied.

### Additional Features
* Visualization of growth history to track the number of occupied cells over time.
* Dynamc adjustment of the grid size.
* Accessibility features for improved user experience.

## Performance Analysis
### Performance Metrics
* __Time Complexity:__ The `getNextGeneration` function has a time complexity of O(n^2) due to the need to check each cell's neighbours.
* __Memory Usage:__ Efficient use of sets for storing cell states ensures minimal memory overhead.
* __Responsiveness:__ The application maintains high responsiveness by leveraging React's state management and efficient DOM updates.

###Performance Review
* The application handles the default grid size (20x20) efficiently, with updates every 1 second (default).
* Larger grid sizes may impact performance due to the increased number of cells to process. Optimization strategies include reducing the interval for cell division or improving the algoritm's efficiency.
* The use of `requestAnimationFrame` could be considered for smoother updates and animations.

## Conclusion
The Cell Growth Simulation project provides a robust and interactive visualization of bacterial cell growth on a grid. With user-friendly controls, accessibility features, and detailed growth history, it offers a comprehensive tool for studying cell growth dynamics.