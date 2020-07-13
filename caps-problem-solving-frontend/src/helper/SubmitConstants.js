class ResultClass {
    constructor(color, name) {
        this.color = color;
        this.name = name;
    }
}

const Result = [
    new ResultClass('#f44336', '틀렸습니다'),
    new ResultClass('#00E676', '맞았습니다'),
    new ResultClass('#8E24AA', '컴파일 에러'),
    new ResultClass('#8E24AA', '런타임 에러'),
    new ResultClass('#E53935', '메모리 초과'),
    new ResultClass('#E53935', '시간 초과'),
    new ResultClass('#00ACC1', '채점중...'),
    new ResultClass('#00ACC1', '대기중...'),
]

module.exports = {
    Result: Result,
};