import React, {
    useState,
    useEffect,
    useContext,
    createContext,
    useCallback,
    useRef,
} from 'react'
import Chain from 'anilink'

const DisplaySwitchContext = createContext(null)

const useDisplaySwitch = () => {
    const context = useContext(DisplaySwitchContext)
    if (!context) throw new Error('Must be used in DisplaySwitch')
    return context
}

const DisplaySwitchProvider = ({ children }) => {
    const [displayed, setDisplayed] = useState(0)
    const [names, setNames] = useState([])
    const scrollingRef = useRef(false)

    const next = useCallback(
        (direction = 1) => {
            return () =>
                new Chain(300)
                    .animate(`#${names[displayed]}`, {
                        transform: `translateY(-100vh)`,
                        opacity: 0,
                    })
                    .cb(() =>
                        setDisplayed((x) => {
                            if (direction) {
                                return ++x === names.length ? 0 : x
                            }
                            return --x < 0 ? names.length - 1 : x
                        })
                    )
                    .exec()
        },
        [names, displayed]
    )

    useEffect(() => {
        // TODO: refine this
        const handleScroll = async (e) => {
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            )

            if (
                scrollingRef.current ||
                (window.scrollY < docHeight - window.innerHeight &&
                    window.scrollY > 0)
            )
                return
            scrollingRef.current = true

            new Chain(300)
                .cb(next(e.deltaY > 0 ? 1 : 0))
                .cb(() => (scrollingRef.current = false))
                .exec()
        }
        document.addEventListener('wheel', handleScroll)
        return () => document.removeEventListener('wheel', handleScroll)
    }, [next])

    const value = {
        names,
        setNames,
        displayed,
        setDisplayed,
        next,
    }

    return (
        <DisplaySwitchContext.Provider value={value}>
            {children}
        </DisplaySwitchContext.Provider>
    )
}

const DisplaySwitch = ({ children }) => {
    const { displayed, setNames, names } = useDisplaySwitch()
    const child = children.find(
        (child) => child.props.name === names[displayed]
    )

    useEffect(() => {
        setNames(children.map((child) => child.props.name))
    }, [children, setNames])

    if (!child) return null

    return child
}

export default DisplaySwitchProvider
export { DisplaySwitchProvider, DisplaySwitch, useDisplaySwitch }
