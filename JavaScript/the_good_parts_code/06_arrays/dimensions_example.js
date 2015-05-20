Array.dim = function(dimension) {
    var a = [ ], i;
    for (i = 0; i < dimension; i++) {
        a[i] = 0;
    }
    return a;
};
console.log(Array.dim(10)); // [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

Array.matrix = function(rows, columns) {
    var m = [ ], a, i, j;
    for (i = 0; i < rows; i++) {
        m[i] = [ ];
        for (j = 0; j < columns; j++) {
            m[i][j] = 0;
        }
    }
    return m;
};
console.log(Array.matrix(2, 3));// [ [ 0, 0, 0 ], [ 0, 0, 0 ] ]
