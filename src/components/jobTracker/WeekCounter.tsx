import React from 'react'; 
import { bool, num, str } from '../../utils/types';
import { FormFields } from './JobForm';


interface Props {
    /**
    @description: Applications passed as props used to indicate time lapse
    **/
    applications: FormFields[]; 
}


interface Time {
    /**
    @description: Describes dt for this comp state. 
    **/
    currTime:   str; 
    numOfWeeks: num; 
}


class WeekCounter extends React.Component<Props, Time> {
    /**
    @description: Simple comp that shows the time lapsed in weeks since the first application submitted. 
    **/
    state:Time = {
        currTime:   new Date().toString().slice(0,15), 
        numOfWeeks: 0, 
    }

    private weeksSinceFirstApp = ():num => {
        /**
        @description: Calculates the number of weeks that have passed since the first application
        **/
        let firstWeek:any = this.props.applications[0].date_submited_on, 
            currWeek:str =  new Date().toString().slice(0,15); 

        let startDate:any = new Date(firstWeek), 
            endDate:any = new Date(currWeek), 
            timeInWeeks = (endDate - startDate) * (1/1000) * (1/ 60) * (1/60) * (1/24) * (1/7); 
        return Math.ceil(timeInWeeks); 
    }

    public componentDidMount() { 
        /**
        @description: When the comp is mounted, this lifecycle method is fired once. Here you can perform
        any initial setups ... the reason why you would not want to have `this.weekSinceFirstApp()` 
        triggered in the rendered phase is b/c it diverges into an infinit loop. Since `setState` 
        causes a re-render - having the rendering phase re-render, then rendering, and re-render - causes
        an infinit loop to form. It is always best to only have initialization values such as VAR or 
        fn that do not change the state be triggered in the rendering phase. 
        **/
        let weeks = this.weeksSinceFirstApp(); 
        this.setState({numOfWeeks: weeks});  
    }


    render() {
        return (
        <div style={{color: 'blue'}}>WeekCounter: { this.state.numOfWeeks }</div>
        )
    }
}

export default WeekCounter; 