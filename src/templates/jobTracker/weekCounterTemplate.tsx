import React from 'react'; 
import { num } from '../../utils/types';

interface Props {
    currWeek: num; 
}

class WeekCounterTemplate extends React.Component<Props>{
    
    public render() {
        
        return (
            <div>
                Current Week: {this.props.currWeek}<br/>
            </div>
        )
    }
}

export default WeekCounterTemplate