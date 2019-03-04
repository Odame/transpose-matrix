const inquirer = require('inquirer');

const isPositiveWholeNumber = (number_) => {
    const asFloat = Number.parseFloat(number_);
    const asInt = Number.parseInt(number_);

    return asInt == asFloat && asInt > 0;
}

const positiveNumberInputValidator = (input) => {
    return new Promise((resolve) => {
        resolve(
            isPositiveWholeNumber(input) ?
                true : 'You must enter a POSITIVE INTEGER'
        )
    })
};

const makeRowInputValidator = (numCols) => {
    return (input) => {
        return new Promise((resolve) => {
            // squash multiple spaces into one
            const elements = input.toString().trim().split(/[ ]+/);
            resolve(
                elements.length === numCols ?
                    true : `You must enter exactly ${numCols} items separated by spaces`
            );
        })
    }
}

/**
 * Get number of rows and number of columns from user input (stdin)
 * @param {inquirer} inquirer
 * @returns {Promise<{numRows: number, numCols: number}>}
 */
const getMatrixDimensionsFromUser = (inquirer) => new Promise((resolve, reject) => {
    const dimensionsQuestions = [
        {
            type: 'number',
            name: 'numRows',
            default: 3,
            message: "NUMBER OF ROWS >>",
            validate: positiveNumberInputValidator
        },
        {
            type: 'number',
            name: 'numCols',
            default: 3,
            message: "NUMBER OF COLUMNS >>",
            validate: positiveNumberInputValidator
        }
    ];
    inquirer.prompt(dimensionsQuestions).then((answers) => resolve({
        'numRows': Number.parseInt(answers.numRows),
        'numCols': Number.parseInt(answers.numCols)
    })).catch(error => reject(error))
});

/**
 * Get the elements of a matrix from user input (stdin)
 * @param {inquirer} inquirer
 * @param {number} numRows Expected number of rows of the matrix
 * @param {number} numCols Expected number of columns of the matrix
 * @returns {Promise<number[][]>}
 */
const getMatrixElementsFromUser = (numRows, numCols, inquirer) => new Promise((resolve, reject) => {
    const rowsQuestions = [];
    // we will prompt user to enter the elements row by row
    for (let i = 0; i < numRows; i++)
        rowsQuestions.push({
            type: 'input',
            name: `row_${i}`,
            message: `Row ${i}>>`,
            validate: makeRowInputValidator(numCols),
        })

    inquirer.prompt(rowsQuestions).then((rowsAnswers) => {
        const matrix = [];
        for (let row = 0; row < numRows; row++)
            matrix.push(rowsAnswers[`row_${row}`].trim().split(/[ ]+/))
        resolve(matrix);
    }).catch(error => reject(error))
});


module.exports = {
    inquirer,
    getMatrixDimensionsFromUser,
    getMatrixElementsFromUser
}