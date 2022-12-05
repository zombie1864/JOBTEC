import React from 'react'
import JobForm, { FormFields } from './JobForm';
import Button from '../common/Button'; 
import { str, num, onClick, bool } from '../../utils/types';
import '../../css/jobTracker/trackerList.css'; 


interface TrackerListProps {
    apps:               FormFields[]; 
    deleteApp:          (event:onClick) => void; 
    editApplication:    (event:onClick) => void; 
    editingIdx?:        num | undefined; 
    editingAppData?:    FormFields | undefined; 
    compClassNameData?: str | undefined; 
    sendDataFn:         (data:FormFields) => void

}


type datasetByDays = (str|FormFields[])[] //[['Mon Nov 01 20xx', FormFields[]], ...,[n, FormFields[]]]


const TrackerList: React.FC<TrackerListProps> = ({
        apps, deleteApp, editApplication, editingIdx, editingAppData, compClassNameData, sendDataFn
    }):JSX.Element => {
    /**
    @description: Func comp that renders application list 
    **/
    /** 
        [devNotes]: 
            []_On the UI show only the apps sent in the curr week. 
            []_Old apps can be shown by onClicking a btn `show week #'s applications`
            []_applications need to be divided into weeks 
                week 1: 
                    - ... 
                    - ... 
                week 2: 
                    - ... 
                    - ... 
                    - ... 
            []_ds: [(1, FormFields[]),(2, FormFields[]), ...,(n, FormFields[])]
    **/
    const parseDataSetByWeeks = (initDataset:FormFields[]):any => {
        /**
        @description: place holder
        **/
        let orderByDayDataset:datasetByDays = parseDataSetByDays(initDataset); 
        console.log(orderByDayDataset);
    }


    const parseDataSetByDays = (initDataset:FormFields[]):datasetByDays => {
        /**
        @description: 
        **/
        let orderByDayDataset:any[] = [], 
        day:str | undefined     = '', 
        appsSentOnGivenDay:any  = []; 

        initDataset.forEach((entry:FormFields, idx:num) => {
            let lastEntry:bool = idx === initDataset.length - 1; 

            if (day === '') { // on the first entry begin initialization 
                day = entry.date_submited_on; 
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


    parseDataSetByWeeks(apps)
    return (
        
        <div className='trackerListCompContainer'>
            {apps.map( (app, idx) => {
                let deleteLbl   = 'Delete',
                    editLbl     = 'Edit'; 

                if (idx === editingIdx) {
                    return <div key={idx}>{
                        <JobForm sendData={sendDataFn} 
                            compClassName={compClassNameData}
                            editingApp={editingAppData}/>
                    }</div>
                } else {
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
                            handleOnClickEvent={deleteApp} 
                            value={idx}/>
                        <Button btnLbl={editLbl} 
                            withEventObj={true}
                            handleOnClickEvent={editApplication} 
                            value={idx}/>
                    </div>
                }
            })}
        </div>
    )
}

export default TrackerList