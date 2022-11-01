import React from 'react'; 
import Button from '../common/Button'; 
import JobForm from './JobForm';
import { bool, str, num, onClick } from '../../utils/types'
import { FormFields } from './JobForm';
import TrackerList from './TrackerList';


interface JobTracker {
    addNewSubmission:   bool; 
    applications:       FormFields[]; 
}


class JobTrackerComp extends React.Component<{}, JobTracker> {
    /**
    @description: This class comp defines props and state. If no props an empty 
    obj is passed. If no state then no state is defined. This comp houses the child comp
    `JobForm` within the this parent comp. Note, comp that are parent comp that contain more
    than a sinmgle child can be thought of as factory comp. This comp is a factory comp that 
    renders multiple comps and contains a centralized `store`-like state that can be passes as
    props to its chidlren. 
    **/
    state:JobTracker = {
        addNewSubmission:   false, 
        applications:       []
    }


    private handleOnClick = ():void => {
        /**
        @description: onClick; either renders or hides the job Tracker Form. 
        **/
        this.setState({addNewSubmission: !this.state.addNewSubmission}); 
    }


    private recieveNewApplication = (data:FormFields):void => {
        /**
        @description: Aux fn that recieves data from child comp and adds to dataset. Also makes use 
        of web storage API `localStorage` to store data in the browser. This API survives page 
        refreshes (sessionStorage) and even browser restarts. Note that using localStorage as a 
        database isn't best practice since the data will be lost when the usr clears the cache. 
        LocalStorage is good for adding dark mode features, saving a to-do list among other scenarios. 
        Here localStorage is used but the data can be backed up to store at a real database. 
        **/
        this.setState({applications: [...this.state.applications, data]}); // ASYNC process 
        let dataSet:FormFields[] = this.state.applications; 
        dataSet.push(data); // used to update localStorage as sync process 
        this.setLocalStorage('myTrackerList', dataSet); 
    }
        
         
    private setLocalStorage = (key:str, value:FormFields[]):void => {
        /**
        @description: Setter method that uses browser API `localStorage` to store JSON data 
        to browser's cache 
        **/
        localStorage.setItem(key, JSON.stringify(value));
    }


    private getLocalStorage = (key:str):FormFields[] => {
        /**
        @description: Getter method that uses browser's API to retrieve JSON data parsed. 
        localStorage is of type str | null but `JSON.parse` takes only str args.
        **/
        return JSON.parse(localStorage.getItem(key) || '[]'); 
    }


    public componentDidMount() {
        /**
        @description: When the comp is mounted onto the DOM, gets localStorage data and sets state
        **/
        let myTrackerListData:FormFields[] = this.getLocalStorage('myTrackerList'); 
        this.setState({applications: myTrackerListData}); 
    }

    
    private deleteApp = (e:onClick):void => {
        /**
        @description: Handles deleteing an app from applications 
        **/
        const target = e.target as HTMLInputElement; 
        const idx:num = parseInt(target.value); 
        this.state.applications.splice(idx,1); // rm and returns app being deleted 
        this.setState({applications: this.state.applications}); // updates applications w mutated arr 
        this.setLocalStorage('myTrackerList', this.state.applications); 
    }


    private downloadDataSet = ():void => {
        /**
        @description: Downloads `this.state.applications` by generating JSON file. The mechanism includes
        the use of the `Blob` obj. A "Blob" refers to a chunk of binary data, the name comes from SQL db,
        and can be large in size. The `URL.createObjectURL` method creates a DOM string which repr the 
        specified file or blob obj. An `a` (hyperlink) htmlEl is used and sets the `download` ATTR to 
        be a specified name. Finally the `href` ATTR is assigned and the `.click()` method simulates 
        a mouse click; needed for using a fnRef/cb fn. 
        **/
       const data   = JSON.stringify(this.state.applications), // stringify dataset 
             blob   = new Blob([data], {type:"text/plain"}), // create new blob data 
             url    = URL.createObjectURL(blob), // DOM repr of blob file 
             link   = document.createElement('a'); // create anonymous anchor tag 
       link.download = 'trackerData.json'; // set ATTR
       link.href = url; // set ATTR
       link.click(); // simulates mouse-click 
    }


    public render() {
        /**
        @description: renders `Button` fn comp, `JobForm` class comp, and the `TrackerList` fn comp
        **/
        let addLbl:str      = 'Add New Submission',
            backupLbl:str   = 'Download Tracker Data'; 
        
        return(
            <div>
                <Button btnLbl={addLbl}
                    withEventObj={false}
                    handleOnClick={this.handleOnClick}/> 

                {   this.state.addNewSubmission && 
                    <JobForm sendData={this.recieveNewApplication}/>
                }

                {   this.state.applications.length !== 0 && 
                    <TrackerList apps={this.state.applications}
                        deleteApp={this.deleteApp}/>
                }

                <Button btnLbl={backupLbl} 
                    withEventObj={false}
                    handleOnClick={this.downloadDataSet}/>
            </div>
        )
    }
}

export default JobTrackerComp