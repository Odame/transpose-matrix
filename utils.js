const columnify = require('columnify');

/** Get a nicely formatted version of a matrix as a string.
 * For printing to console.
 *
 * For example, given the matrix [[1, 2, 3], [4, 5, 6], [7, 8, 9]] and title 'TEE',
 * the returned string, when printed, will be:

```
TEE
(3X3) Matrix
------------
1  2  3
4  5  6
7  8  9
```
 * @param {any[][]} matrix The matrix to be printed
 * @param {string?} title An optional title to be displayed in the heading
 * @returns {String}
*/
const getMatrixFormattedString = (matrix, title) => {
    const numRows = (matrix || []).length;
    const numCols = (matrix[0] || []).length;

    // the heading will display the dimensions of the matrix
    const heading = `${numRows}X${numCols} Matrix`;

    // the hyphens must underline the title and heading completely
    const underline = '-'.repeat(Math.max((title || '').trim().length, heading.length));

    // construct the matrix body itself
    const colOptions = {};
    for (let col = 0; col < numCols; col += 1) {
        // use space as headings
        colOptions[`${col}`] = { headingTransform: () => ' ' };
    }
    const matrixBody = columnify(
        matrix,
        {
            columnSplitter: '  ', // add a little more space between elements in the same row
            config: colOptions,
        },
    ).trimLeft(); // trim() to remove the 'space-as-heading's

    return `${(title || '') && `${title.trim()}\n`}${heading}\n${underline}\n${matrixBody}`;
};

/**
 * Returns the transpose of a matrix.
 * Nb: A matrix is assumed to have the same number of elements in each row
 * @param {number[][]} matrix Should have an equal number of elements in each row
 * @returns {number[][]}
 */
const getMatrixTranspose = (matrix) => {
    const numRows = (matrix || []).length;
    const numCols = (matrix[0] || []).length; // all the rows contain the same number of elements

    const tMatrix = [];

    for (let col = 0; col < numCols; col += 1) {
        // take each column of the original matrix
        // and make it a row in the transposed matrix
        const tRow = [];
        for (let row = 0; row < numRows; row += 1) {
            tRow.push(matrix[row][col]);
        }
        tMatrix.push(tRow);
    }

    return tMatrix;
};

const isPositiveWholeNumber = (number_) => {
    const asFloat = Number.parseFloat(number_);
    const asInt = Number.parseInt(number_, 10);

    return asInt === asFloat && asInt > 0;
};


module.exports = {
    getMatrixTranspose,
    getMatrixFormattedString,
    isPositiveWholeNumber,
};
