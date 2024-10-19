const fs = require('fs');
function decodeValue(base, value) {
    return parseInt(value, base);
}
function parseJSONAndDecode(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const n = data.keys.n;
    const k = data.keys.k;
    
    let points = [];
    for (let key in data) {
        if (key !== 'keys') {
            let x = parseInt(key);
            let y = decodeValue(parseInt(data[key].base), data[key].value);
            points.push({ x, y });
        }
    }
    
    return { n, k, points };
}
function lagrangeInterpolation(points, k) {
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                li *= -points[j].x / (xi - points[j].x);
            }
        }

        constantTerm += yi * li;
    }

    return Math.round(constantTerm);
}
function findSecretConstantTerm(filename) {
    const { n, k, points } = parseJSONAndDecode(filename);
    
    points.sort((a, b) => a.x - b.x);

    const constantTerm = lagrangeInterpolation(points, k);

    console.log("The secret (constant term) is:", constantTerm);
    return constantTerm;
}
findSecretConstantTerm('testcase1.json');
findSecretConstantTerm('testcase2.json');
