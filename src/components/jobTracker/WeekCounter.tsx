import React from 'react'; 
import WeekCounterTemplate from '../../templates/jobTracker/weekCounterTemplate';
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
    currTime:               str; 
    numOfWeeks:             num; 
}


class WeekCounter extends React.Component<Props, Time> {
    /**
    @description: Simple comp that shows the time lapsed in weeks since the first application submitted. 
    **/
    state:Time = {
        currTime:   new Date().toString().slice(0,15), 
        numOfWeeks: 0 
    }


    private weeksSinceFirstApp = ():num => {
        /**
        @description: Calculates the number of weeks that have passed since the first application. 
        The `firstWeek` will be undefined when the comp is initially rendered but when the 
        `componentDidMount` lifecycle hits `firstWeek` will be defined as a string. 
        **/
       
        let firstWeek:str = this.props.applications[0].date_submited_on !== undefined ? 
                            this.props.applications[0].date_submited_on : 'Sat Jan 01 2000', 
            currWeek:str =  new Date().toString().slice(0,15);
        
        return this.weeksSinceCounter(firstWeek, currWeek); 
    }


    private appSentPerWeekDataset = ():num[][] => {
        /**
        @description: A parsing algo that returns an arr of arr of nums repr the application's week 
        of submission and the number of applications submitted on that given week, e.g: 
        [[1, 25], [2, 10]] (first arr reads: "week 1, 25 applications sent").
        **/
        let arrOfSubmissionDate:str[]       = this.arrOfappSubmissionDate(), 
            appCounterDataset:any           = this.applicationsCounter(arrOfSubmissionDate), 
            startDate:str | undefined       = this.props.applications[0].date_submited_on; 

        appCounterDataset.forEach((entry:(str|num)[]) => {
            entry[0] = this.weeksSinceCounter(startDate, entry[0]); // changes date to numerical num
        })

        return appCounterDataset[0][0] === undefined ? [[0, 0]] : appCounterDataset; 
    }


    private arrOfappSubmissionDate = ():str[] => {
        /**
        @description: An algo that return an arr containing the applications submission date. 
        **/
        if (this.props.applications !== undefined) {
            let dataset:any = []; 
            this.props.applications.forEach((app) => {
                dataset.push(app.date_submited_on); 
            })
            return dataset; 
        }
        return ['']; 
    }


    private applicationsCounter = (dataset:str[]):(str|num)[][] => {
        /**
        @description: Takes in dataset and counts how many apps where sent on a given day. 
        **/
        let counterContainer:any    = [], 
            day:str                 = '', 
            counter:num             = 0; 

        dataset.forEach((date, idx) => {            
            if (day === '') // initalizes this fn VARs
                { 
                    day = date; 
                    counter += 1; 
                } 
            else if (day !== date) // saves prev values and initalizes this fn VARs to the next day 
                { 
                    counterContainer.push([day, counter]); 
                    day = date; 
                    counter = 1; 
                } 
            else if (day === date && idx === dataset.length - 1) // handles last day
                {  
                    counter += 1; // includes the last entry 
                    counterContainer.push([day, counter]); 
                } 
            else // incr counter 
                { 
                    counter += 1; 
                }
        })
        return counterContainer.length === 0 ? [['Jan 01 2000', 1]] : counterContainer; 
    }


    private weeksSinceCounter = (initialDate:any, date:any):num => {
        /**
        @description: Counts how many weeks has passed between the startDate and the date
        **/
        let endDate:any = new Date(date), // any type to allow Js-specific wonky logic 
            startDate:any = new Date(initialDate), // allows Js-specific wonky logic - see nxt line
            timeInWeeks:num = (endDate - startDate) * (1/1000) * (1/ 60) * (1/60) * (1/24) * (1/7); 
        
        return Math.ceil(timeInWeeks) === 0 ? 1 : Math.ceil(timeInWeeks); 
    }


    public componentDidMount() { 
        /**
        @description: When the comp is mounted, this lifecycle method is fired once. Here you can perform
        any initial setups ... [NOTE: look up offical ways to use this comp]the reason why you would not want to have `this.weekSinceFirstApp()` 
        triggered in the rendered phase is b/c it diverges into an infinit loop. Since `setState` 
        causes a re-render - having the rendering phase re-render, then rendering, and re-render - causes
        an infinit loop to form. It is always best to only have initialization values such as VAR or 
        fn that do not change the state be triggered in the rendering phase. 
        **/
        let weeks = this.weeksSinceFirstApp(); 
        this.setState({numOfWeeks: weeks});  
    }


    public render() {
        // let data = this.appSentPerWeekDataset(); 
        return (
        <div style={{color: 'blue'}}>
            <WeekCounterTemplate numOfWeeks={this.state.numOfWeeks}/>
            {this.appSentPerWeekDataset().map((entry, idx) => {
                return <p key={idx}>Week: {entry[0]} App sent: {entry[1]}</p>
            })}
        </div>
        )
    }
}

export default WeekCounter; 