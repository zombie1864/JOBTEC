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
    editingIdx?:        num | undefined; 
    editingAppData?:    FormFields | undefined; 
    compClassNameData?: str | undefined; 
    sendDataFn:         (data:FormFields) => void

}


interface List {
    /**
    @description: 
    **/
    showPrevWeeks: num[]
}
 

type datasetByDays  = (str | FormFields[])[] //[['Mon Nov 01 20xx', FormFields[]], ...,[k, FormFields[]]]
type strDate        = str | FormFields | any // used to bypass js wonky logic 


class TrackerList extends React.Component<TrackerListProps, List> {
    /**
    @description: Comp that renders application list 
    []_What is missing is the logic to know what the curr week is 
    []_in the render() 
        []_IF len(this.state.showPrevWeeks) == 0
            []_itr(app, appEntry[1])
                []_return app 
        []_ELIF appEntry[0] in this.state.showPrevWeeks
            []_itr(app, appEntry[1])
                []_return app 
    **/
    state:List = {
        showPrevWeeks: []
    }

    
    private parseDataSetByWeeks = (initDataset:FormFields[]):any => {
        /**
        @description: place holder
        **/
        let orderByDayDataset:datasetByDays = this.parseDataSetByDays(initDataset),
            startDate:strDate               = orderByDayDataset[0][0], // date that first app was sent 
            monOfFirstWeek:Date             = getMonday(new Date(startDate))
        
        orderByDayDataset.forEach((entry:any):any => {
            // changes dataset from per day unit to per week unit 
            let dateObj:Date = new Date(entry[0]); // verbal date 
            entry[0] = weeksSinceCounter(monOfFirstWeek, dateObj) // changes date to numerical num
        })

        return flattenDataset(orderByDayDataset, true)
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


    public render() {
        // console.log(this.parseDataSetByWeeks(this.props.apps)); 
        console.log();
        return (
            
            <div className='trackerListCompContainer'>
                {this.props.apps.map( (appEntry, idx) => {
                    let deleteLbl   = 'Delete',
                        editLbl     = 'Edit'; 
    
                    if (idx === this.props.editingIdx) {
                        return <div key={idx}>{
                            <JobForm sendData={this.props.sendDataFn} 
                                compClassName={this.props.compClassNameData}
                                editingApp={this.props.editingAppData}/>
                        }</div>
                    } else {
                        return <div key={idx} className='trackerListContentContainer'>
                            <span>{appEntry.company_name}</span>
                            <span>{appEntry.job_title}</span>
                            <span>{appEntry.status}</span>
                            <span>{appEntry.date_submited_on}</span>
                            <span>{appEntry.submitted_with_cover_letter}</span>
                            <span>{appEntry.site_applied_on}</span>
                            <span>{appEntry.notes}</span>
                            <Button btnLbl={deleteLbl} 
                                withEventObj={true}
                                handleOnClickEvent={this.props.deleteApp} 
                                value={idx}/>
                            <Button btnLbl={editLbl} 
                                withEventObj={true}
                                handleOnClickEvent={this.props.editApplication} 
                                value={idx}/>
                        </div>
                    }
                })}
            </div>
        )
    }
}

export default TrackerList