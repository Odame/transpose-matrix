const inquirer = require('inquirer');
const { getMatrixFormattedString, getMatrixTranspose } = require('./utils');
const { getMatrixDimensionsFromUser, getMatrixElementsFromUser } = require('./cli');

(
    async () => {
        console.log('Welcome.\nThis programme is used to determine the transpose of a matrix.\n');

        // request for matrix dimensions from the user
        const dimensions = await getMatrixDimensionsFromUser(inquirer);

        // request for matrix elements from the user
        const inputMatrix = await getMatrixElementsFromUser(
            dimensions.numRows, dimensions.numCols, inquirer,
        );

        const transposedMatrix = getMatrixTranspose(inputMatrix);

        // print a formatted version of the original matrix and its transpose to console
        console.log('\n\n-----------------------------------');
        console.log(getMatrixFormattedString(inputMatrix, 'Original Matrix'));
        console.log('\n\n-----------------------------------');
        console.log(getMatrixFormattedString(transposedMatrix, 'Transposed Matrix'));
        console.log('\n\n-----------------------------------');
    }
)()
    .then(() => process.exit())
    .catch((error) => {
        console.error('An error occurred while running script');
        console.error(error);
        process.exit(1);
    });
