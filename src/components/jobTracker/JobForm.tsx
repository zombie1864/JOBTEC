import React from 'react'
import JobFormTemplate from '../../templates/jobTracker/jobFormTemplate'; 
import {str, bool, eventChange, formEvent} from '../../utils/types'
import { Validator, isValidForm } from '../../validators/formValidator';
 

export interface FormFields {
  /**
  @description: Interface that defines the dt to the formField obj. Defining dt to 
  the formFields help with maintaining the formFields isolated into an object 
  rather than hardcoding them. This makes it more modular when needing to iter 
  over fields in the rendering portion. The interface is being exported to be 
  iter'd in the template file. 
  **/
  company_name:                 str; 
  job_title:                    str; 
  status:                       str; 
  date_submited_on:             str; 
  submitted_with_cover_letter:  bool; 
  site_applied_on:              str; 
  notes:                        str; 
  errFields?:                   str[]; // contains field names that have err 
}

export interface FormFieldValues {
  /**
  @description: Interface that defines dt for field values 
  **/
  jobTitles:      str[]; 
  statusOpt:      str[]; 
  sitesAppliedTo: str[];
}

interface Props {
  /**
  @description: Props defining `sendData` - in which the child comp, JobForm, sends data to parent comp
  `NewJob` to add data to dataset. 
  **/
  sendData: (data:FormFields) => void 
}


class JobForm extends React.Component<Props, FormFields> {
  /**
  @description: Logic to controlled comp for the form fields 
  **/
  state:FormFields = {
    /**
    @description: Internal state for any new form comp
    **/
    company_name:                 '', 
    job_title:                    'none', // behaves as `defaultValue='none'` attr to select tag 
    status:                       'submitted', // default value 
    date_submited_on:             new Date().toString().slice(0,15), 
    submitted_with_cover_letter:  false,
    site_applied_on:              'none', // default value 
    notes:                        '',
    errFields:                    [] 
  }

  private baseState:FormFields = Object.assign({}, this.state); // deep copy of initial comp state 


  private handleFieldValueChange = (e: eventChange):void => {
    /**
    @description: Dynamic handler that setState dynamically using e.target.className as the key and 
    e.target.value as the value. Used for handling changes to input field and dropdown selection. 
    **/
    let key   = e.target.className, 
        value = e.target.value; 
    this.setState({ [key]: value } as unknown as Pick<FormFields, keyof FormFields>); 
  }


  private handleOnClickradioBtn = ():void => {
    /**
    @description: When usr `onClick` radio btn on UI, setState for submitted_with_cover_letter
    **/
    this.setState({submitted_with_cover_letter: !this.state.submitted_with_cover_letter}); 
  }


  private handleSubmit = (e: formEvent) => { 
    /**
    @description: UI form is a controlled component, the input fields are also controlled comp, using 
    state to extract data from form field. This fn deals w extraction of data, then validates the data,
    finally sends data as props to the JobList comp for rendering on the UI. 
    **/
    e.preventDefault(); // prevents default behavior of performing HTTP transmit for forms
    let data:FormFields = {...this.state}; // shallow copy of state "data extraction"
    let validatorObj:Validator = isValidForm(data); 

    if (!validatorObj.validForm) { // checks if form is valid 
      this.setState({errFields: validatorObj.errFields}); 
    } else {
      this.props.sendData(data); 
      this.setState({...this.baseState}); 
    }
  }

  private formatFieldName = (fieldName:str, exception:str = '', value:str = ''):str => {
    /**
    @description: Fn takes unformated fieldName and formats to be rendered on the UI. The default 
    delimiter that this fn checks against is "_". E.g. formatFieldName("hello_world") => "hello world"
    The fn also checks against exceptions the usr wishes to return a specified value for. 
    formatFieldName("hello_world", "hello_world", "hello jeff") => "hello jeff", where the last two 
    params are optional to usr. 
    **/
    if (fieldName === exception) {
      return value; 
    }
    let formatedFieldName:str = fieldName.split('_').join(' '); 
    return formatedFieldName; 
  }


  public render() {

    let formFieldValues:FormFieldValues = {
      /**
      @description: Field values used in conjunction w the form template. These values are then passed
      as props. 
      **/
      jobTitles: [
          'Jr Software Developer', 
          'Software Engineer', 
          'Frontend Developer'
      ], 
      statusOpt: ['Submitted', 'Rejected', 'Process', 'Accepted'], 
      sitesAppliedTo: ['LinkedIn', 'Indeed', 'OnSite']
    }

    return (
      <div>
        <JobFormTemplate 
          formFields={this.state}
          formFieldValues={formFieldValues}
          formatedDate={this.state.date_submited_on}
          radioCheckedValue={this.state.submitted_with_cover_letter}
          handleFieldValueChange={this.handleFieldValueChange}
          handleOnClickradioBtn={this.handleOnClickradioBtn}
          handleSubmit={this.handleSubmit}
          formatFieldName={this.formatFieldName}
        />
      </div>
    )
  }
}

export default JobForm