document.addEventListener('DOMContentLoaded', function() {
    //arriba se carga el DOM y abajo se obtienen elementos del HTML por su id
    const matrixSizeInput = document.getElementById('matrixSize');
    const createMatricesButton = document.getElementById('createMatrices');
    const randomValuesButton = document.getElementById('randomValues');
    const exampleMatrixButton = document.getElementById('exampleMatrix');
    const clearMatricesButton = document.getElementById('clearMatrices');
    const addMatricesButton = document.getElementById('add');
    const subtractMatricesButton = document.getElementById('subtract');
    const multiplyMatricesButton = document.getElementById('multiply');
    const scalarInput = document.getElementById('scalar');
    const scalarMultiplyButton = document.getElementById('scalarMultiply');
    const transposeButton = document.getElementById('transpose');
    const determinantButton = document.getElementById('determinant');
    const inverseButton = document.getElementById('inverse');
    const identityButton = document.getElementById('identity');
    const resultMatrixDisplay = document.getElementById('resultMatrix');
    const matrixAContainer = document.getElementById('matrixA');
    const matrixBContainer = document.getElementById('matrixB');

    //variables para la creacion y manejo de las matrices
    let matrixSize = 2;
    let matrixA = [];
    let matrixB = [];

    //Funcion para crear las matrices vacias
    function createMatrixInputs() {
        matrixSize = parseInt(matrixSizeInput.value);
        if (matrixSize < 2 || matrixSize > 10) {
            //Condicional para el tamaño de la matriz
            alert("El tamaño de la matriz debe estar entre 2 y 10.");
            return;
        }

        matrixAContainer.innerHTML = '';
        matrixBContainer.innerHTML = '';

        matrixAContainer.style.gridTemplateColumns = `repeat(${matrixSize}, 1fr)`;
        matrixBContainer.style.gridTemplateColumns = `repeat(${matrixSize}, 1fr)`;

        matrixA = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
        matrixB = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));

        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                const inputA = document.createElement('input');
                inputA.type = 'number';
                inputA.value = 0;
                inputA.id = `A_${i}_${j}`;
                matrixAContainer.appendChild(inputA);

                const inputB = document.createElement('input');
                inputB.type = 'number';
                inputB.value = 0;
                inputB.id = `B_${i}_${j}`;
                matrixBContainer.appendChild(inputB);
            }
        }
    }

    //Funcion que obtiene los valores insertados por el usuario, ajustada para asegurarse de que los valores sean numericos
    function getMatrixValues(matrixId) {
        const matrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                const inputId = `${matrixId}_${i}_${j}`;
                const inputValue = parseFloat(document.getElementById(inputId).value);
                if (isNaN(inputValue)) {
                    alert("Ingrese valores numericos.");
                    return null;
                }
                matrix[i][j] = inputValue;
            }
        }
        return matrix;
    }

    function setMatrixValues(matrix, matrixId) {
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                const inputId = `${matrixId}_${i}_${j}`;
                document.getElementById(inputId).value = matrix[i][j];
            }
        }
    }

    //Indicada por su mismo nombre, esta funcion muestra el resultado de cualquiera de las operaciones realizadas
    function displayResult(result) {
        if (typeof result === 'string') {
            resultMatrixDisplay.textContent = result;
        } else if (Array.isArray(result)) {
            let matrixString = result.map(row => row.join('\t')).join('\n');
            resultMatrixDisplay.textContent = matrixString;
        } else {
            resultMatrixDisplay.textContent = result;
        }
    }

    //suma de matrices
    function addMatrices(a, b) {
        if (a.length !== b.length || a[0].length !== b[0].length) {
            return "Las matrices deben tener las mismas dimensiones para la suma.";
        }
        const result = a.map((row, i) => row.map((val, j) => val + b[i][j]));
        return result;
    }

    //resta de matrices
    function subtractMatrices(a, b) {
        if (a.length !== b.length || a[0].length !== b[0].length) {
            return "Las matrices deben tener las mismas dimensiones para la resta.";
        }
        const result = a.map((row, i) => row.map((val, j) => val - b[i][j]));
        return result;
    }

    //multiplicacion de matrices
    function multiplyMatrices(a, b) {
        const rowsA = a.length;
        const colsA = a[0].length;
        const rowsB = b.length;
        const colsB = b[0].length;

        //algo redundante porque no se permiten ingresar matrices cuyo numero de columnas sea distinto al de filas y viceversa
        if (colsA !== rowsB) {
            return "El numero de columnas de A debe ser igual al numero de filas de B para la multiplicacion.";
        }

        const result = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }
    
    //funcion escalar (k x A)
    function scalarMultiply(matrix, scalar) {
        return matrix.map(row => row.map(val => val * scalar));
    }

    //funcion transponer matriz
    function transposeMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const result = Array(cols).fill(null).map(() => Array(rows).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }

    //determinante de la matriz
    function determinant(matrix) {
        const n = matrix.length;

        if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }

        let det = 0;
        for (let i = 0; i < n; i++) {
            const submatrix = Array(n - 1).fill(null).map(() => Array(n - 1).fill(0));
            for (let j = 1; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    if (k < i) {
                        submatrix[j - 1][k] = matrix[j][k];
                    } else if (k > i) {
                        submatrix[j - 1][k - 1] = matrix[j][k];
                    }
                }
            }
            det += matrix[0][i] * Math.pow(-1, i) * determinant(submatrix);
        }
        return det;
    }

    //matriz inversa, chequea que pueda ser invertible
    function inverseMatrix(matrix) {
        const det = determinant(matrix);
        if (det === 0) {
            return "La matriz no es invertible (determinante = 0).";
        }

        const n = matrix.length;
        const adjugate = Array(n).fill(null).map(() => Array(n).fill(0));

        if (n === 2) {
            adjugate[0][0] = matrix[1][1];
            adjugate[0][1] = -matrix[0][1];
            adjugate[1][0] = -matrix[1][0];
            adjugate[1][1] = matrix[0][0];
        } else {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const submatrix = Array(n - 1).fill(null).map(() => Array(n - 1).fill(0));
                    for (let row = 0; row < n; row++) {
                        for (let col = 0; col < n; col++) {
                            if (row !== i && col !== j) {
                                const subRow = row < i ? row : row - 1;
                                const subCol = col < j ? col : col - 1;
                                submatrix[subRow][subCol] = matrix[row][col];
                            }
                        }
                    }
                    adjugate[j][i] = Math.pow(-1, i + j) * determinant(submatrix);
                }
            }
        }

        const inverse = scalarMultiply(adjugate, 1 / det);
        return inverse;
    }

    //matriz identidad
    function identityMatrix(size) {
        const identity = Array(size).fill(null).map(() => Array(size).fill(0));
        for (let i = 0; i < size; i++) {
            identity[i][i] = 1;
        }
        return identity;
    }

    //boton esencial para crear la matriz
    createMatricesButton.addEventListener('click', createMatrixInputs);

    //este boton asigna valores aleatorios a la matriz sin importar el tamaño
    randomValuesButton.addEventListener('click', function() {
        matrixSize = parseInt(matrixSizeInput.value);
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                document.getElementById(`A_${i}_${j}`).value = Math.floor(Math.random() * 21) - 10;
                document.getElementById(`B_${i}_${j}`).value = Math.floor(Math.random() * 21) - 10;
            }
        }
    });

    //esta funcion crea una matriz de ejemplo, sin embargo es poco ortodoxa ya que no actua con matrices mayores a 4x4
    exampleMatrixButton.addEventListener('click', function() {
        matrixSize = parseInt(matrixSizeInput.value);
        if (matrixSize === 2) {
            setMatrixValues([[1, 2], [3, 4]], 'A');
            setMatrixValues([[5, 6], [7, 8]], 'B');
        } else if (matrixSize === 3) {
            setMatrixValues([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 'A');
            setMatrixValues([[9, 8, 7], [6, 5, 4], [3, 2, 1]], 'B');
        } else if (matrixSize > 3) {
            //se intento establecer una advertencia pero no funciona del todo bien
            alert("Establezca el tamaño de la matriz en 2 o 3")
        }
    });

    //limpia los ajustes y valores de las matrices a un 2x2 vacio
    clearMatricesButton.addEventListener('click', function() {
        matrixSize = parseInt(matrixSizeInput.value);
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                document.getElementById(`A_${i}_${j}`).value = 0;
                document.getElementById(`B_${i}_${j}`).value = 0;
            }
        }
    });

    //De aqui en adelante son botones que ejecutan las operaciones antes mencionadas

    addMatricesButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        const b = getMatrixValues('B');
        if (a && b) {
            const result = addMatrices(a, b);
            displayResult(result);
        }
    });

    subtractMatricesButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        const b = getMatrixValues('B');
        if (a && b) {
            const result = subtractMatrices(a, b);
            displayResult(result);
        }
    });

    multiplyMatricesButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        const b = getMatrixValues('B');
        if (a && b) {
            const result = multiplyMatrices(a, b);
            displayResult(result);
        }
    });

    scalarMultiplyButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        const scalar = parseFloat(scalarInput.value);
        if (a) {
            const result = scalarMultiply(a, scalar);
            displayResult(result);
        }
    });

    transposeButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        if (a) {
            const result = transposeMatrix(a);
            displayResult(result);
        }
    });

    determinantButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        if (a) {
            const result = determinant(a);
            displayResult(result.toFixed(4));
        }
    });

    inverseButton.addEventListener('click', function() {
        const a = getMatrixValues('A');
        if (a) {
            const result = inverseMatrix(a);
            displayResult(result);
        }
    });

    identityButton.addEventListener('click', function() {
        matrixSize = parseInt(matrixSizeInput.value);
        const result = identityMatrix(matrixSize);
        displayResult(result);
    });

    createMatrixInputs();
});