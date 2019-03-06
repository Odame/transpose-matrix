const { isPositiveWholeNumber } = require('./utils');

const positiveNumberInputValidator = input => new Promise((resolve) => {
    resolve(
        isPositiveWholeNumber(input)
            ? true : 'You must enter a POSITIVE INTEGER',
    );
});

/**
 * Returns a validator for validating user's input for a row of a matrix
 * @param {number} numCols The number of columns expected in the row
 * @returns {(input: string)=>Promise<boolean | String>}
 */
const makeRowInputValidator = numCols => input => new Promise((resolve) => {
    // split the input string by space(s)
    const elements = input.toString().trim().split(/[ ]+/);
    resolve(
        elements.length === numCols
            ? true : `You must enter exactly ${numCols} items separated by spaces`,
    );
});

/**
 * Get number of rows and number of columns from user input
 * @param {inquirer} inquirer
 * @returns {Promise<{numRows: number, numCols: number}>}
 */
const getMatrixDimensionsFromUser = inquirer => new Promise(
    (resolve, reject) => {
        const dimensionsQuestions = [
            {
                type: 'number',
                name: 'numRows',
                default: 3,
                message: 'Enter the dimensions of matrix\nNumber Of Rows >>',
                validate: positiveNumberInputValidator,
            },
            {
                type: 'number',
                name: 'numCols',
                default: 3,
                message: 'Number of Columns >>',
                validate: positiveNumberInputValidator,
            },
        ];
        inquirer.prompt(dimensionsQuestions)
            .then(answers => resolve({
                numRows: Number.parseInt(answers.numRows, 10),
                numCols: Number.parseInt(answers.numCols, 10),
            }))
            .catch(error => reject(error));
    },
);


/**
 * Get the elements of a matrix from user input
 * @param {inquirer} inquirer
 * @param {number} numRows Expected number of rows of the matrix
 * @param {number} numCols Expected number of columns of the matrix
 * @returns {Promise<number[][]>}
 */
const getMatrixElementsFromUser = (numRows, numCols, inquirer) => new Promise((resolve, reject) => {
    const rowsQuestions = [
        {
            name: 'just-a-message',
            message: 'Enter the elements of the matrix, row by row.\nFor each row, enter the column elements as a space-separated list\nPress ENTER to continue',
        },
    ];
    // we will prompt user to enter the elements row by row
    for (let i = 0; i < numRows; i += 1) {
        rowsQuestions.push({
            type: 'input',
            name: `row_${i}`,
            message: `Row ${i}>>`,
            validate: makeRowInputValidator(numCols),
        });
    }
    inquirer.prompt(rowsQuestions).then((rowsAnswers) => {
        const matrix = [];
        for (let row = 0; row < numRows; row += 1) {
            matrix.push(rowsAnswers[`row_${row}`].trim().split(/[ ]+/));
        }
        resolve(matrix);
    }).catch(error => reject(error));
});


module.exports = {
    getMatrixDimensionsFromUser,
    getMatrixElementsFromUser,
};
