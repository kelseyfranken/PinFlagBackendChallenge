export function getRandomInteger(min, max) {
    /* code from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function generateRangeNumArray(num, max_count=826){
    let numArr = []
    let range = num > max_count ? max_count : num;
    for (let i = 1; i <= range; i++) {
        numArr.push(i)
    }
    return numArr
}
