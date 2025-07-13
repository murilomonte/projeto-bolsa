const errorToString = function(errorList) {
    let string = '';
    for (let i in errorList) {
        string += `${errorList[i]}\n`;
    }
    return string;
}

exports.errorToString = errorToString;