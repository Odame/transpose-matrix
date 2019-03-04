// main entry point of the application
const { inquirer, getMatrixDimensionsFromUser, getMatrixElementsFromUser } = require('./cli');
const columnify = require('columnify');

/** Print a nicely formatted version of a matrix to console */
const printMatrix = (matrix, title) => {
    const numRows = (matrix || []).length;
    const numCols = (matrix[0] || []).length; // all the rows contain the same number of elements

    const colOptions = {};
    for (let col = 0; col < numCols; col++)
        colOptions[`${col}`] = { headingTransform: () => ' ' } // use space as headings

    const matrixString = columnify(
        matrix,
        {
            columnSplitter: '  ', // add a little more space between elements in the same row
            config: colOptions
        }
    ).trim(); // trim() to remove the 'space-as-heading's

    console.log('***************************');
    console.log(`${title} | (${numRows}X${numCols})`);
    console.log('***************************');
    console.log(matrixString);
    console.log('***************************');
}

/**
 * Get the transpose of a matrix of given dimensions
 * @param {number[][]} matrix Should have an equal number of elements in each row 
 * @returns {number[][]}
 */
const getTranspose = (matrix) => {
    const numRows = (matrix || []).length;
    const numCols = (matrix[0] || []).length; // all the rows contain the same number of elements

    const tMatrix = [];

    for (let col = 0; col < numCols; col++) {
        const tRow = [];
        // a column becomes a row in the transposed matrix
        for (let row = 0; row < numRows; row++)
            tRow.push(matrix[row][col])
        tMatrix.push(tRow);
    }

    return tMatrix
}



const run = async () => {
    console.log('Welcome.\nThis programme is used to determine the transpose of a matrix.');

    console.log('To start, enter the dimensions of your matrix');
    const dimensions = await getMatrixDimensionsFromUser(inquirer);

    console.log('Enter the elements of each row as a space-separated list');
    const inputMatrix = await getMatrixElementsFromUser(
        dimensions.numRows, dimensions.numCols, inquirer
    );
    printMatrix(inputMatrix, 'Original Matrix');

    const transposedMatrix = getTranspose(inputMatrix);
    printMatrix(transposedMatrix, 'Transposed Matrix');
}

run().catch(error => {
    console.error('An error occurred while running script');
    console.error(error);
});
