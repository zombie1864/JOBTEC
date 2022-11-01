import React from 'react'; 
import {FormFields, FormFieldValues} from '../components/jobTracker/JobForm'; 
import {str, bool, eventChange, formEvent} from '../utils/types'


interface Props {
    /**
    @description: interface `FormFields` is being imported to define the dt for this
    template's props. The formfield props is iter'd to render the fields for usr to 
    import data on. 
    **/
    formFields:             FormFields; 
    formFieldValues:        FormFieldValues; 
    formatedDate:           str; 
    handleFieldValueChange: (event: eventChange) => void; 
    handleOnClickradioBtn:  () => void; 
    radioCheckedValue:      bool; 
    handleSubmit:           (event: formEvent) => void; 
}


class JobFormTemplate extends React.Component<Props>{
    
    public render() {
        return (
            <div>
            {/* jsxElStart: FORM */}
                <form onSubmit={this.props.handleSubmit}>
                {Object.keys(this.props.formFields).map( (fieldName, idx) => {
                    return <label key={idx}>
                        {fieldName !== 'errFields' && `${fieldName}:`} 
                        {   fieldName === 'company_name' ? 

                            // {/* jsxElStart: COMP NAME */}
                                <input className={fieldName} 
                                value={this.props.formFields.company_name}
                                onChange={this.props.handleFieldValueChange}/> : 
                            // {/* jsxElEnd: COMP NAME */}

                            fieldName === 'job_title' ? 

                            // {/* jsxElStart: JOB TITLE OPT */}
                                <select className={fieldName} 
                                    value={this.props.formFields.job_title} 
                                    onChange={this.props.handleFieldValueChange}
                                >
                                    <option value='none' disabled hidden>
                                        -Select Job Title-
                                    </option>
                                    {this.props.formFieldValues.jobTitles.map( (title, idx) => {
                                        return <option key={idx}
                                                value={title}>
                                                    {title}
                                                </option>
                                    })}
                                </select> : 
                            // {/* jsxElEnd: JOB TITLE OPT */}
                        
                            fieldName === 'status' ? 

                            // {/* jsxElStart: STATUS OPT */}
                                <select className={fieldName}
                                    onChange={this.props.handleFieldValueChange}
                                >
                                    {this.props.formFieldValues.statusOpt.map( (option, idx) => {
                                        return <option key={idx}
                                                value={option}
                                                >
                                                    {option}
                                                </option>
                                    })}
                                </select> :
                            // {/* jsxElEnd: STATUS OPT */}

                            fieldName === 'date_submited_on' ? 

                            // {/* jsxElStart: SUBMITION DATE */}
                                <span>{this.props.formatedDate}</span> : 
                            // {/* jsxElEnd: SUBMITION DATE */}
                            
                            fieldName === 'submitted_with_cover_letter' ? 

                            // {/* jsxElStart: COVER LETTER OPT */}
                                <div>
                                    <label>Yes:</label>
                                    <input type='radio' 
                                        name='radioToggle' 
                                        value='yes'
                                        onClick={this.props.handleOnClickradioBtn}
                                    /> 
                                    <label>No:</label>
                                    <input type='radio' 
                                        name='radioToggle' 
                                        value='no'
                                        onClick={this.props.handleOnClickradioBtn}
                                        defaultChecked
                                    /> 
                                </div> : 
                            // {/* jsxElEnd: COVER LETTER OPT */}
                            
                            fieldName === 'site_applied_on' ? 

                            // {/* jsxElStart: SITE APPLIED OPT */}
                                <select className='site_applied_on'
                                    value={this.props.formFields.site_applied_on}
                                    onChange={this.props.handleFieldValueChange}
                                >
                                    <option value='none' disabled hidden>
                                        -Select Site-
                                    </option>
                                    {this.props.formFieldValues.sitesAppliedTo.map( (site, idx) => {
                                        return <option key={idx} value={site}>{site}</option>
                                    })}
                                </select> : 
                            // {/* jsxElEnd: SITE APPLIED OPT */}

                            fieldName === 'notes' ? 

                            // {/* jsxElStart: Notes */}
                                <input className={fieldName} 
                                value={this.props.formFields.notes}
                                onChange={this.props.handleFieldValueChange}/> :
                            // {/* jsxElEnd: Notes */}

                            null 
                        }
                    </label>
                })}
                
                {/* jsxElStart: RENDER Err */}
                    {   this.props.formFields.errFields?.length !== 0 && 
                        this.props.formFields.errFields?.map( (errField, idx) => {
                            return <p key={idx}>Error Detected on {errField}</p>
                        })
                    }
                {/* jsxElEnd: RENDER Err */}

                {/* jsxElStart: SUBMIT FORM BTN */}
                    <input type='submit'/>
                {/* jsxElEnd: SUBMIT FORM BTN */}
                </form>
            {/* jsxElEnd: FORM */}
          </div>
        )
    }
}

export default JobFormTemplate