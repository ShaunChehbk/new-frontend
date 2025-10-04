const convertIdToDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const min = date.getMinutes()
    // return [year, month, day]
    return `${year} - ${month} - ${day} - ${hour} - ${min}`
}

export {
    convertIdToDate
}