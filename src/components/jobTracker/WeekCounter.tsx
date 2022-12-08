import React from 'react'; 
import WeekCounterTemplate from '../../templates/jobTracker/weekCounterTemplate';
import { bool, num, str } from '../../utils/types';
import { getMonday, weeksSinceCounter, flattenDataset } from '../../utils/time'
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
        numOfWeeks: 0 
    }


    private appSentPerWeekDataset = ():num[][] => {
        /**
        @description: A parsing algo that returns an arr of arr of nums repr the application's week 
        of submission and the number of applications submitted on that given week, e.g: 
        [[1, 25], [2, 10]] (first arr reads: "week 1, 25 applications sent").
        **/
        let arrOfSubmissionDate:str[]   = this.arrOfappSubmissionDate(), // changes applications
            dataset:(any|num)[][]       = this.applicationsCounter(arrOfSubmissionDate), 
            startDate:str | undefined   = this.props.applications[0].date_submited_on, 
            monOfStartDate:Date         = getMonday(new Date(startDate || 'Jan 01 2000'));
        
        dataset.forEach((entry:(str|num)[]) => {
            let dateObj:Date = new Date(entry[0]); // verbal date 
            entry[0] = weeksSinceCounter(monOfStartDate, dateObj); // changes date to numerical num
        }) // NOTE: this mutates the data inside VAR dataset
        
        return dataset[0][0] === undefined ? [[0, 0]] : flattenDataset(dataset); 
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
            if (day === '') { // initalizes this fn VARs {
                day = date; 
                counter += 1; 
            } 
            else if (day !== date) { // saves prev values and initalizes this fn VARs to the next day 
                counterContainer.push([day, counter]); 
                day = date; 
                counter = 1; 
            } 
            else if (day === date && idx === dataset.length - 1) { // handles last day
                counter += 1; // includes the last entry 
                counterContainer.push([day, counter]); 
            } 
            else { // incr counter  
                counter += 1; 
            }
        })
        return counterContainer.length === 0 ? [['Jan 01 2000', 1]] : counterContainer; 
    }


    public componentDidMount() { 
        /**
        @description: When the comp is mounted, this lifecycle method is fired once. Here you can perform
        any initial setups ... [NOTE: look up offical ways to use this comp]the reason why you would not want to have `this.weekSinceFirstApp()` 
        triggered in the rendered phase is b/c it diverges into an infinit loop. Since `setState` 
        causes a re-render - having the rendering phase re-render, then rendering, and re-render - causes
        an infinit loop to form. It is always best to only have initialization values such as VAR or 
        fn that do not change the state be triggered in the rendering phase. 
        Calculates the number of weeks that have passed since the first application 
        was sent. The `firstWeek` will be undefined when the comp is initially rendered but when the 
        `componentDidMount` lifecycle hits `firstWeek` will be defined as a string. 
        **/
        if (this.props.applications[0] !== undefined) {
            let firstWeek:str = this.props.applications[0].date_submited_on || 'Jan 01 2000', 
                weeks = weeksSinceCounter(getMonday(new Date(firstWeek)), new Date());
            
                this.setState({numOfWeeks: weeks});  
        }
    }


    public render() {
        
        return (
        <div style={{color: 'blue'}}>
            <WeekCounterTemplate numOfWeeks={this.state.numOfWeeks}/>
            {this.appSentPerWeekDataset().map((entry, idx) => {
                return <p key={idx}>Week: {entry[0]} # of App sent: {entry[1]}</p>
            })}
        </div>
        )
    }
}

export default WeekCounter; 