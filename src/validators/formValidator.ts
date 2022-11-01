import { FormFields } from "../components/jobTracker/JobForm"

export interface Validator {
    validForm:  boolean; 
    errFields?: string[]; 
}

export const isValidForm = (data:FormFields):Validator => {
    /**
    @description: Generic iter that checks against empty fields. The field "notes" is excluded b/c usr
    is allowed to leave this field empty. Validator returns Obj with default key "validForm". If 
    validator detects err, key attr "errFields" is added to Obj
    **/
    let validatorObj:Validator = { validForm: true }; 

    for (const [key, value] of Object.entries(data)) {
        if (key !== 'notes' && (value === 'none' || value === '')) {
            validatorObj.validForm = false; 
            if (!("errFields" in validatorObj)) {
                validatorObj.errFields = []; 
            } 
            validatorObj.errFields?.push(key); // adds to array the key for which err was detected on 
        }
    }
    return validatorObj; 
}