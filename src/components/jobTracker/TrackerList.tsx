import React from 'react'
import JobForm, { FormFields } from './JobForm';
import Button from '../common/Button'; 
import { str, num, onClick } from '../../utils/types';
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


const TrackerList: React.FC<TrackerListProps>= ({
    apps, deleteApp, editApplication, editingIdx, editingAppData, compClassNameData, sendDataFn
}):JSX.Element => {
    /**
    @description: Func comp that renders application list 
    **/
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