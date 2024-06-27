export interface Cell {
    x: number;
    y: number;
}

export interface GrowthConfig {
    growthRate: number; //ms
}

const directions = [
    { dx: -1, dy: 0}, // left
    { dx: 1, dy: 0}, // right
    { dx: 0, dy: -1}, // up
    { dx: 0, dy: 1} // down
];

export const getNextGeneration = (cells: Set<string>, gridSize: number): Set<string> => {
    const newCells = new Set<string>(cells);

    cells.forEach(cell => {
        const [x, y] = cell.split(',').map(Number);

        directions.forEach(({ dx, dy }) => {
            const nx = x + dx;
            const ny = y + dy;
            const newCellKey = `${nx},${ny}`;

            if (nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize && !cells.has(newCellKey)) {
                newCells.add(newCellKey);
            }
        });
    });

    return newCells;
};
