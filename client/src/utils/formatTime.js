const formatTime = (seconds) => {
    let hours = '' + Math.floor(seconds / (60 * 60))
    hours = hours.length < 2 ? '0' + hours : hours
    seconds %= 60 * 60
    let minutes = '' + Math.floor(seconds / 60)
    minutes = minutes.length < 2 ? '0' + minutes : minutes
    seconds = '' + (seconds % 60)
    seconds = seconds.length < 2 ? '0' + seconds : seconds

    return `${hours}:${minutes}:${seconds}`
}

export default formatTime
