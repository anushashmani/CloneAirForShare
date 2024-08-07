import React from 'react'
import { useDropzone } from 'react-dropzone'

import './index.scss'


function DropZone({ titleElement, onDrop }) {

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    return (
        <div className='drop-zone' {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="">
                {titleElement}
            </div>
        </div>
    )
}

export default DropZone