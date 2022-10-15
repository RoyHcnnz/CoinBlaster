const isSameDay = function (d1, d2) {
    return (d1.getFullYear() == d2.getFullYear()
        && d1.getMonth() == d2.getMonth()
        && d1.getDate() == d2.getDate())
};

const isToday = function (d) {
    return isSameDay(d, new Date());
};

const isNextDay = function (earlyD, lateD) {
    // two dates at most 48 hrs apart and the day must be next to each other
    return (lateD.getTime() - earlyD.getTime() <= 48 * 60 * 60 * 1000
        && (earlyD.getDay() + 1) % 7 == lateD.getDay())
};

const isYesterday = function (d) {
    return isNextDay(d, new Date);
};

module.exports = {
    isSameDay,
    isToday,
    isNextDay,
    isYesterday
}