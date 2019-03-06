const { expect } = require('chai');
const { getMatrixTranspose, isPositiveWholeNumber, getMatrixFormattedString } = require('../utils');
const { getMatrixDimensionsFromUser, getMatrixElementsFromUser } = require('../cli');
const runApp = require('inquirer-test');
const { UP, DOWN, ENTER } = require('inquirer-test');
const inquirer = require('inquirer');
const path = require('path');


describe('getMatrixTranspose()', () => {
    it('should return an array of array', () => {
        const matrix = [[1, 2]];
        const transpose = getMatrixTranspose(matrix);

        expect(transpose).to.be.a('Array', 'The result of the transpose should be an array of rows');
        for (const row of transpose) {
            expect(row).to.be.a('Array', 'Each row should be an array');
        }
    });

    it('should transpose mxn matrix into nxm matrix', () => {
        const matrix = [[1, 2], [3, 4], [45, 12]];
        const transpose = getMatrixTranspose(matrix);

        expect(matrix[0].length).to.be.equal(
            transpose.length,
            'Number of columns in original matrix should be the same as number of rows in transposed matrix'
        );
        for (const row_ of transpose) {
            expect(row_.length).to.be.equal(
                matrix.length,
                'Number of rows in original matrix should be the same as number of columns in transposed matrix'
            );
        };

    });

    it('should return same thing for 1x1 matrix', () => {
        const matrix = [[1]];
        const transpose = getMatrixTranspose(matrix);
        expect(transpose.length).equal(matrix.length, 'Should have the same number of rows as the original matrix');
        expect(transpose).eql(matrix, 'For a 1x1 matrix, the transpose should be the same');
    })
});

describe('isPositiveWholeNumber()', () => {
    it('should return true for positive number', () => {
        const result = isPositiveWholeNumber(100);
        expect(result).to.be.equal(true, 'For 100 it should return true');
    });

    it('should return false for zero', () => {
        const result = isPositiveWholeNumber(0);
        expect(result).to.be.equal(false, 'For 0 it should return false');
    });

    it('should return false for negative number', () => {
        const result = isPositiveWholeNumber(-23);
        expect(result).to.be.equal(false, 'For -23 it should return false');
    });

    it('should return false for a non-number', () => {
        const result = isPositiveWholeNumber('THIS-IS-NOT-A-NUMBER');
        expect(result).to.be.equal(false, 'For a non-number it should return false');
    })
});

describe('getMatrixFormattedString()', () => {
    it('should return (m+3) lines of text for an mxn matrix, including title', () => {
        const matrix = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
        const outputString = getMatrixFormattedString(matrix, 'Test');
        expect(outputString.split('\n')).to.have.length(
            3 + matrix.length, 'Output string should contain 3 + n lines of text'
        );
    });

    it('should return (m+2) lines of text for an mxn matrix, without title', () => {
        const matrix = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
        const outputString = getMatrixFormattedString(matrix);
        expect(outputString.split('\n')).to.have.length(
            2 + matrix.length, 'Output string should contain 3 + n lines of text'
        );
    });

    it('returns expected outputString with title', () => {
        const matrix = [[1, 2], [1, 2], [1, 2]];
        const expectedOutputString = 'Test\n3X2 Matrix\n----------\n1  2\n1  2\n1  2';
        const outputString = getMatrixFormattedString(matrix, 'Test');
        expect(outputString).to.be.equals(
            expectedOutputString, `Should return ${expectedOutputString}`
        );
    });

    it('returns expected outputString without title', () => {
        const matrix = [[1, 2], [1, 2], [1, 2]];
        const expectedOutputString = '3X2 Matrix\n----------\n1  2\n1  2\n1  2';
        const outputString = getMatrixFormattedString(matrix);
        expect(outputString).to.be.equals(
            expectedOutputString, `Should return ${expectedOutputString}`
        );
    });
});

describe('getMatrixDimensionsFromUser()', () => {
    let inquirerPrompt;
    before(() => {
        inquirerPrompt = inquirer.prompt
        // stub inquirer's prompt() to simulate the user having entered '3' and '4' as dimensions
        inquirer.prompt = () => new Promise(resolve => resolve({ numRows: '3', numCols: '4' }));
    });

    it('returns object containing numRows and numCols', async () => {
        const dimensions = await getMatrixDimensionsFromUser(inquirer);
        expect(dimensions).to.have.all.keys(['numRows', 'numCols']);
    });

    it('returns dimensions as integers', async () => {
        const dimensions = await getMatrixDimensionsFromUser(inquirer);
        expect(dimensions.numRows).to.satisfy((num) => Number.isInteger(num));
        expect(dimensions.numCols).to.satisfy((num) => Number.isInteger(num));
    });

    after(() => {
        inquirer.prompt = inquirerPrompt;
    });
});

describe('getMatrixElementsFromUser()', () => {
    let inquirerPrompt;

    before(() => {
        inquirerPrompt = inquirer.prompt;

        /** @param {any[]} questions */
        inquirer.prompt = (questions) => new Promise(resolve => (
            resolve(
                questions.slice(1) // ignore the first question, which is just a message actually
                    .reduce((prev, curr) => ({ ...prev, [curr.name]: '1 2 3' }), {})
            )
        ));
    });

    it('returns matrix elements as an array of array', async () => {
        const matrix = await getMatrixElementsFromUser(2, 3, inquirer);
        expect(matrix).to.be.a('Array', 'Should return an array');
    });

    it('returns matrix with expected dimensions', async () => {
        const matrix = await getMatrixElementsFromUser(2, 3, inquirer);
        expect(matrix).to.have.length(
            2,
            'For getMatrixElementsFromUser(2, 3, inquirer), the number of rows in the returned matrix should be 2'
        );

        for (const row of matrix) {
            expect(row).to.have.length(
                3,
                'For getMatrixElementsFromUser(2, 3, inquirer), the number of columns in the returned matrix should be 3'
            );
        }
    });

    after(() => {
        inquirer.prompt = inquirerPrompt;
    });
});


// functional tests

// #1: ignores 0 as a dimension.

// #2: ignores invalid rows input.
// #3: displays the right information to the console.

describe('functional tests', () => {
    const appPath = path.join(__dirname, '../.');

    it('Should run successfully', async () => (
        new Promise((resolve, reject) => {
            runApp(
                [appPath],
                ['0', ENTER, '1', ENTER, '3', ENTER, ENTER, '1 2 3', ENTER]
            )
                // output, is whatever is printed to console at the end of running the app
                .then((output) => {
                    expect(output).to.match(
                        /1X3 Matrix/g,
                        'A 1X3 matrix (original matrix) should have been printed'
                    );

                    expect(output).to.match(
                        /3X1 Matrix/g,
                        'A 3X1 matrix (transposed matrix) should have been printed'
                    )

                    expect(output).to.match(
                        new RegExp('Original Matrix', 'g'),
                        "'Original Matrix' should have been printed to console",
                    );
                    expect(output).to.match(
                        new RegExp('Transposed Matrix', 'g'),
                        "'Transposed Matrix' should have been printed to console",
                    );

                    resolve();
                }).catch(error => reject(error));

        })
    ));

});