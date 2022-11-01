import React from 'react'
import { bool, onClick } from '../../utils/types';

interface ButtonProps {
    btnLbl:                 string; // to lbl btn 
    withEventObj:           bool; // for fn that make use of the event obj 
    value?:                 any; // any value assigned to value ATTR 
    handleOnClick?:         () => void; // cb fn that does not use event obj 
    handleOnClickEvent?:    (event:onClick) => void; // fn that use event obj to access ATTR values
}

const Button: React.FC<ButtonProps> = ({
        btnLbl, 
        withEventObj, 
        value, 
        handleOnClick, 
        handleOnClickEvent
    }):JSX.Element => {
    /**
    @description: Generic btn comp that is modular in design to be reuable across this app  
    **/
    
    return (
        <div>
            <button value={value} 
                onClick={withEventObj ? handleOnClickEvent : handleOnClick}
            >{btnLbl}</button>
        </div>
    )
}

export default Button