import React from 'react'
import JobForm, { FormFields } from './JobForm';
import Button from '../common/Button'; 
import { str, num, onClick, bool } from '../../utils/types';
import '../../css/jobTracker/trackerList.css'; 
import { getMonday, weeksSinceCounter, flattenDataset } from '../../utils/time';


interface TrackerListProps {
    apps:               FormFields[]; 
    deleteApp:          (event:onClick) => void; 
    editApplication:    (event:onClick) => void; 
    editingId?:         num | undefined; 
    editingAppData?:    FormFields | undefined; 
    compClassNameData?: str | undefined; 
    sendDataFn:         (data:FormFields) => void

}


interface List {
    /**
    @description: 
    **/
    showPrevWeeks: num[]; 
    currWeek: num; 
}
 

type datasetByDays  = (str | FormFields[])[][]//[['Mon Nov 01 20xx', FormFields[]],...,[k, FormFields[]]]
type datasetByWeeks = (num | FormFields[])[]
type strDate        = str | FormFields | any // used to bypass js wonky logic 


class TrackerList extends React.Component<TrackerListProps, List> {
    /**
    @description: Comp that renders application list 
    []_NOTE: there is wonky behavior when there is only 1 jobApp on the tracker list - can only edit once
    after eding the id is `undefined`
    **/
    state:List = {
        showPrevWeeks: [], 
        currWeek: 0, 
    }

    
    private parseDataSetByWeeks = (initDataset:FormFields[]):any => {
        /**
        @description: place holder
        **/
        let orderByDayDataset:datasetByDays = this.parseDataSetByDays(initDataset),
            startDate:strDate               = orderByDayDataset[0][0], // date that first app was sent 
            monOfFirstWeek:Date             = getMonday(new Date(startDate))
        
        orderByDayDataset.forEach((entry:any):any => { // change dataset; per day unit to per week unit 
            let dateObj:Date = new Date(entry[0]); // verbal date 
            entry[0] = weeksSinceCounter(monOfFirstWeek, dateObj) // changes date to numerical num
        })

        if (orderByDayDataset.length === 1) { // when software is used on the first day 
            return orderByDayDataset; 
        }
        else { // when software is used more than the first day 
            return flattenDataset(orderByDayDataset, true)
        }
    }


    private parseDataSetByDays = (initDataset:FormFields[]):datasetByDays => {
        /**
        @description: Changes init dataset to the following format: 
        [['Mon Nov 01 20xx',FormFields[]], ...]
        Arr of arr in which each arr provides the day and how many apps where sent on that day
        **/
        let orderByDayDataset:any[]     = [], 
            day:str | undefined         = '', 
            appsSentOnGivenDay:any      = []; 

        if (initDataset.length === 1) { // When initDataset contains 1 entry; initial use of software 
            return [[new Date().toString().slice(0, 15), initDataset]]
        }

        initDataset.forEach((entry:FormFields, idx:num) => {
            let lastEntry:bool = idx === initDataset.length - 1; 

            if (day === '') { // on the first entry begin initialization 
                day = entry.date_submited_on; 
                appsSentOnGivenDay.push(entry);
            }
            else if (day !== entry.date_submited_on) { // day change 
                orderByDayDataset.push([day, appsSentOnGivenDay]); 
                day = entry.date_submited_on; // change day to curr day 
                appsSentOnGivenDay = [entry]; // reset appsSentOnGivenDay 
            } else if (day === entry.date_submited_on && lastEntry) { // last entry is the same day 
                appsSentOnGivenDay.push(entry); 
                orderByDayDataset.push([day, appsSentOnGivenDay]); 
            }
            else { // default behavior of adding entry to appsSentOnGivenDay
                appsSentOnGivenDay.push(entry); 
            }
        })
        return orderByDayDataset; 
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
        if (this.props.apps[0] !== undefined) {
            let firstWeek:str   = this.props.apps[0].date_submited_on || 'Jan 01 2000', 
                weeks           = weeksSinceCounter(getMonday(new Date(firstWeek)), new Date());
            
                this.setState({currWeek: weeks});  
        }
    }

    private renderApps = (formFieldsArr:any, deleteLbl:any, editLbl:any, editingIdx:any=null):any => {
        return formFieldsArr.map((app:any, idx:num) => {
            if (app.id === editingIdx) {  
                return <div key={idx}>{
                    <JobForm apps={this.props.apps}
                        sendData={this.props.sendDataFn} 
                        compClassName={this.props.compClassNameData}
                        editingApp={this.props.editingAppData}/>
                }</div>
            } 
            else {
                return <div key={idx} className='trackerListContentContainer'>
                    <span>{app.company_name}</span>
                    <span>{app.job_title}</span>
                    <span>{app.status}</span>
                    <span>{app.date_submited_on}</span>
                    <span>{app.submitted_with_cover_letter}</span>
                    <span>{app.site_applied_on}</span>
                    <span>{app.notes}</span>
                    <Button btnLbl={deleteLbl} 
                        withEventObj={true}
                        handleOnClickEvent={this.props.deleteApp} 
                        value={app.id}/>
                    <Button btnLbl={editLbl} 
                        withEventObj={true}
                        handleOnClickEvent={this.props.editApplication} 
                        value={app.id}/>
                </div>
            }
        })
    }


    public render() {
        let dataset:datasetByWeeks = this.parseDataSetByWeeks(this.props.apps)
        
        return (
            <div className='trackerListCompContainer'>
                {dataset.map((appEntry:(num | FormFields[]), idx:num) => {
                    let deleteLbl           = 'Delete',
                        editLbl             = 'Edit', 
                        formFieldsIdx       = '1', 
                        weekNumIdx          = '0', 
                        formFieldsArr:any   = appEntry[formFieldsIdx as keyof (num | FormFields[])],
                        weekNum:any         = appEntry[weekNumIdx as keyof (num | FormFields[])]; 
                     
                    if (this.state.showPrevWeeks.length !== 0) {
                        return this.renderApps(formFieldsArr, deleteLbl, editLbl, this.props.editingId); 
                    } 
                    else if (weekNum !== this.state.currWeek) {
                        return <button key={idx}>{`Show Week ${weekNum}'s Applications`}</button>
                    }
                    else if (weekNum === this.state.currWeek) {
                        return this.renderApps(formFieldsArr, deleteLbl, editLbl, this.props.editingId); 
                    }
                })}
            </div>
        )
    }
}

export default TrackerList