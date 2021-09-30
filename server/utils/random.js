const randomNum = (min, max) => {
    max -= min
    return Math.floor(Math.random() * max + min)
}

const randomEl = (array) => {
    return array[randomNum(0, array.length)]
}

module.exports = {
    randomNum,
    randomEl,
}
