const removeDuplicates = (duplicates) => {
    const flag = {};
    const unique = [];
    duplicates.forEach(element => {
        if (!flag[element.name]) {
            flag[element.name] = true;
            unique.push(element);
        }
    });
    return unique;
};

module.exports = {
    removeDuplicates
};