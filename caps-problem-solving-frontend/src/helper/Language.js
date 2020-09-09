class Lang {
    constructor(x, y) {
        this.langName = x;
        this.langType = y;
    }
}

const Language = [
    new Lang('C', 'C'),
    new Lang('C++', 'CPP'),
    new Lang('Python', 'Python'),
];

module.exports = {
    Language: Language,
};