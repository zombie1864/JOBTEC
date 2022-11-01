import React from 'react'
import { FormFields } from './JobForm';
import Button from '../common/Button'; 
import { onClick } from '../../utils/types';


interface TrackerListProps {
    apps: FormFields[]; 
    deleteApp: (event:onClick) => void; 
}


const TrackerList: React.FC<TrackerListProps>= ({apps, deleteApp}):JSX.Element => {
    /**
    @description: 
    **/
  return (
    <div>
        {apps.map( (app, idx) => {
            let btnLbl = 'Delete';

            return <div key={idx}>
                <span>{app.company_name}</span>
                <span>{app.job_title}</span>
                <span>{app.status}</span>
                <span>{app.date_submited_on}</span>
                <span>{app.submitted_with_cover_letter}</span>
                <span>{app.site_applied_on}</span>
                <span>{app.notes}</span>
                <Button btnLbl={btnLbl} 
                    withEventObj={true}
                    handleOnClickEvent={deleteApp} 
                    value={idx}/>
            </div>
        })}
    </div>
  )
}

export default TrackerList