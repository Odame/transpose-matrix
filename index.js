const inquirer = require('inquirer');
const { getMatrixFormattedString, getMatrixTranspose } = require('./utils');
const { getMatrixDimensionsFromUser, getMatrixElementsFromUser } = require('./cli');

(
    async () => {
        console.log('Welcome.\nThis programme is used to determine the transpose of a matrix.\n');
        const dimensions = await getMatrixDimensionsFromUser(inquirer);

        const inputMatrix = await getMatrixElementsFromUser(
            dimensions.numRows, dimensions.numCols, inquirer,
        );
        const transposedMatrix = getMatrixTranspose(inputMatrix);

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
