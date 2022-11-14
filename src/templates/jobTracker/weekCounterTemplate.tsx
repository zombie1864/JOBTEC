import React from 'react'; 
import { num } from '../../utils/types';

interface Props {
    numOfWeeks: num; 
}

class WeekCounterTemplate extends React.Component<Props>{
    
    public render() {
        
        return (
            <div>
                Current Week: {this.props.numOfWeeks}<br/>
            </div>
        )
    }
}

export default WeekCounterTemplate