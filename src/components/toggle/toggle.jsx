import React, {useState} from 'react'

export const Toggle = ({label, toggled, onClick}) => {
    const [isToggled, toggle] = useState(toggled)
    const [value, setValue] = useState('')

    const callback = () => {
        toggle(!isToggled)
        onClick(!isToggled)
    }
    // const callValue = ()=>{
    //     value(setValue())
    // }

    return (
        <label
            className="inline-flex relative  items-center cursor-pointer">
            <input type="checkbox" onClick={callback}
                   className="sr-only  flex justify-end peer">
            </input>
            <div className="w-11  flex justify-end  h-6 bg-gray-200 peer-focus:outline-none
                    peer-focus:ring-4 peer-focus:ring-blue-300
                    dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                    after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"/>
        </label>
    )
}
