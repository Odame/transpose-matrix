// main entry point of the application
const inquirer = require('inquirer');
const columnify = require('columnify')

/** Print a nicely formatted version of a matrix to console */
const printMatrix = (matrix, title) => {
    const numRows = (matrix || []).length;
    const numCols = (matrix[0] || []).length; // all the rows contain the same number of elements

    const colOptions = {};
    for (let col = 0; col < numCols; col++)
        colOptions[`${col}`] = {
            headingTransform: () => ' '
        }

    const matrixString = columnify(
        matrix,
        {
            columnSplitter: '  ',
            config: colOptions
        }
    );

    console.log('\n******************************');
    console.log(`${title}  (${numRows}X${numCols})`);
    console.log('******************************');
    console.log(matrixString);
    console.log('******************************\n');
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
            tRow.push(matrix[row][col]) // notice how we swap col and row
        tMatrix.push(tRow);
    }

    return tMatrix
}

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

const rowInputValidator = (numCols) => {
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
 * Join multiple validators for inquirer prompt inputs
 * @param  {...()=>Promise<boolean>} validators See https://github.com/SBoudrias/Inquirer.js#objects
 * for more information on the structure of validators
 */
const joinValidators = (...validators) => {
    return new Promise(resolve => {
        Promise.all(validators.map(v => v()))
            .then(validatorValues => {
                for (const value of validatorValues)
                    if (value !== true)
                        resolve(value) // resolve the first validator that fails
                resolve(true); // resolve true if no validator failed
            })
    })
}

/** Read the user's input from stdin and parse it into a matrix */
const promptUserForInput = () => new Promise((resolve) => {
    const dimensionsQuestions = [
        {
            type: 'number',
            name: 'numRows',
            message: "NUMBER OF ROWS >>",
            validate: positiveNumberInputValidator
        },
        {
            type: 'number',
            name: 'numCols',
            message: "NUMBER OF COLUMNS >>",
            validate: positiveNumberInputValidator
        }
    ];

    console.log('Welcome.\nThis programme is used to determine the transpose of a matrix.')
    console.log('To start, please enter the dimensions of your matrix');
    inquirer.prompt(dimensionsQuestions).then((answers) => {
        const numRows = Number.parseInt(answers.numRows)
        const numCols = Number.parseInt(answers.numCols);

        const rowsQuestions = [];
        for (let i = 0; i < numRows; i++)
            rowsQuestions.push({
                type: 'input',
                name: `row_${i}`,
                message: `Row ${i}>>`,
                validate: rowInputValidator(numCols),
            })

        console.log('Please enter the elements of each row as a space-separated list');
        inquirer.prompt(rowsQuestions).then((rowsAnswers) => {
            const matrix = [];
            for (let row = 0; row < numRows; row++)
                matrix.push(rowsAnswers[`row_${row}`].trim().split(/[ ]+/))
            resolve(matrix);
        })

    })
});

promptUserForInput().then((matrix) => {
    printMatrix(matrix, 'Original Matrix');
    const transposedMatrix = getTranspose(matrix);
    printMatrix(transposedMatrix, 'Transposed Matrix');
})
    .catch((err) => {
        console.error('An error occurred while running script');
        console.error(err);
    })


