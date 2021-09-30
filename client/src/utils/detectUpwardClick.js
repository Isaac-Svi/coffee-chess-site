/**
 * @description Checks if target has targeted class or if target's parent has targeted class
 * @param {HTMLElement} target
 * @param {String | Array} targeted
 * @param {Array} exclusions classes or tag names that when reached, make us return false
 * @param {HTMLElement} endCheck element where we end our search
 * @returns {Boolean} whether or not condition in description is true
 */
const detectUpwardClick = (
    target,
    targeted,
    exclusions = [],
    endCheck = document.body
) => {
    exclusions = exclusions.map((x) => x.toUpperCase())

    const isExcluded = () => {
        if (
            exclusions.includes(target.tagName) ||
            [...target.classList].some((x) => exclusions.includes(x))
        ) {
            return true
        }
        return false
    }

    const checkHit = () => {
        if (!target.classList) return false

        if (typeof targeted === 'string')
            return target.classList.contains(targeted)

        if (Array.isArray(targeted)) {
            for (const cls of targeted) {
                if (target.classList.contains(cls)) {
                    return true
                }
            }
        }

        return false
    }

    while (target) {
        if (target === endCheck) return false
        if (checkHit()) return true
        if (isExcluded()) return false

        target = target.parentNode
    }

    return false
}

export default detectUpwardClick
