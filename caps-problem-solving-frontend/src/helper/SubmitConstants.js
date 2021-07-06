class ResultClass {
    constructor(cclass, color, name) {
        this.class = cclass;
        this.color = color;
        this.name = name;
    }
}

const Result = [
    new ResultClass('red accent-1', '#f44336', '틀렸습니다'),
    new ResultClass('green accent-1', '#00E676', '맞았습니다'),
    new ResultClass('purple darken-1', '#8E24AA', '컴파일 에러'),
    new ResultClass('purple darken-1', '#8E24AA', '런타임 에러'),
    new ResultClass('red darken-1', '#E53935', '메모리 초과'),
    new ResultClass('red darken-1', '#E53935', '시간 초과'),
    new ResultClass('cyan darken-1', '#00ACC1', '채점중...'),
    new ResultClass('cyan darken-1', '#00ACC1', '대기중...'),
]

module.exports = {
    Result: Result,
};