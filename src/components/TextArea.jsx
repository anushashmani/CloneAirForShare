import React, { useEffect, useRef } from 'react'
import './index.scss'



function TextArea({ value, onChange, placeholder }) {
  const textareaRef = useRef()
  const resizeTextArea = (event) => {
    textareaRef.current.style.height = "24px"
    // console.log(textareaRef.current.scrollHeight);
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 12 + "px"
  }

  useEffect(() => {
    resizeTextArea()
  }, [value])
  return (
    <textarea value={value} onChange={onChange} ref={textareaRef} onInput={resizeTextArea} placeholder={placeholder} className='text-area'></textarea>
  )
}

export default TextArea