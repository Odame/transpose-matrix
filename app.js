// main entry point of the application

/** Print a nicely formatted version of a matrix to console */
const printMatrix = (matrix, title) => {
    console.log('\n***************');
    console.log(title);
    console.log('***************');
    for(const row of matrix) {
        console.log(row.join(' '));
    }
    console.log('***************\n');
}

/**
 * Get the transpose of a matrix of given dimensions
 * @param {number[][]} matrix Should have an equal number of elements in each row 
 * @returns {number[][]}
 */
const getTranspose = (matrix) => {
    const num_rows = (matrix || []).length;
    const num_cols = (matrix[0] || []).length; // all the rows contain the same number of elements

    const tMatrix = [];

    for (let col=0; col<num_cols; col++) {
        const tRow = [];
        // a column becomes a row in the transposed matrix
        for (let row=0; row <num_rows; row++)
            tRow.push(matrix[row][col]) // notice how we swap col and row
        tMatrix.push(tRow);
    }

    return tMatrix
}

/** Read the user's input from stdin and parse it into a matrix */
const getUserInputAsMatrix = (num_rows, num_cols) => {
    return [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20]
    ]
}

const matrix = getUserInputAsMatrix()
printMatrix(matrix, 'Original Matrix');
const transposedMatrix = getTranspose(matrix);
printMatrix(transposedMatrix, 'Transposed Matrix');


