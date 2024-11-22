import React, {useState} from 'react'
import { Textarea } from '@nextui-org/react'

const ModifyBannedText: React.FC = () => {
    return(
    <Textarea 
        label='Modify Your Banned Words'
        placeholder='Modify Current List Here'
        className = "w-auto"
    />

)
}
export default ModifyBannedText;