import { FormFields } from '../components/jobTracker/JobForm';
import { bool, num, str } from './types';


type appsPerWeek = (str | FormFields[])[]; 


export const getMonday = (date:Date):Date => {
    /**
    @description: Returns the first day of the week from the `date`
    **/
    
    let numOfTheWeek:num = date.getDay(), //num from week of `date`, Sun = 0, Mon = 1, Tue = 2, etc
        numDay:num       = date.getDate(), // gets numerical day of `date`, `Dec 01 2000` => 1
        adjuster:num     = (numOfTheWeek === 0 ? -6 : 1), // adj to Mon = 1, if 0 adjust to last week
        diff:num         = numDay - numOfTheWeek + adjuster; // gets numerical day of Mon 
    
    return new Date(date.setDate(diff)); // sets to the Mon `date` of the week from `date`
}


export const weeksSinceCounter = (initialDate:any, endDate:any):num => {
    /**
    @description: Counts how many weeks has passed between the initial start date and the end date. 
    Any type on `initialDate` and `endDate` allows Js-specific wonky logic for `timeInWeeks`.
    But when use requires `new Date(param)` to be passed as param to this fn 
    **/
    let timeInWeeks:num = (endDate - initialDate) * (1/1000) * (1/ 60) * (1/60) * (1/24) * (1/7); 

    return Math.ceil(timeInWeeks) === 0 ? 1 : Math.ceil(timeInWeeks); 
}


export const flattenDataset = (dataset:(num[][] | appsPerWeek), omitSecEntry:bool=false):num[][] => {
    /**
    @description: Flattens dataset which can contain duplicate week number and combines 
    into a single week-value pair. Ex: [[1, 3],[1, 7],[2, 1],[3, 10]] => [[1, 10], [2, 1], [3, 10]]
    **/
    let flatDataset:any             = [], 
        holdingEntry:any            = [], // holds entry and mutates Ex: [1, 3] -> [1, 10]
        currRunningWeek:num | null  = null; 

    for (let i = 0; i < dataset.length; i++) {
        let currEntry:any = dataset[i], //[weekNum, appSent]
            // conditional VARs
            matchingEntry       = currRunningWeek === currEntry[0], 
            nonMatchingEntry    = currRunningWeek !== currEntry[0], 
            lastEntry           = i === dataset.length - 1; 
        
        if (!currRunningWeek) {                     // deals w initial entry 
            holdingEntry    = currEntry;  
            currRunningWeek = currEntry[0]; 
        } 
        else if (matchingEntry && lastEntry && !omitSecEntry) {      // deals w last matching entry
            holdingEntry[1] += currEntry[1];
            flatDataset.push(holdingEntry); 
        } 
        else if (matchingEntry && lastEntry && omitSecEntry) { // deals w last matching entry 
            holdingEntry[1].push.apply(holdingEntry[1], currEntry[1]); 
            flatDataset.push(holdingEntry)
        }
        else if (nonMatchingEntry && !lastEntry) {  // deals w nxt non-matching entry 
            flatDataset.push(holdingEntry); 
            holdingEntry    = currEntry; 
            currRunningWeek = currEntry[0]; 
        } 
        else if (nonMatchingEntry && lastEntry) {   // deals w last non-matching entry
            flatDataset.push(holdingEntry);         // appends the holding entry from prev itration 
            flatDataset.push(currEntry);             // appends currEntry which is the last entry 
        } 
        else if (omitSecEntry) {                    // default behavior for ds of (num | FormFields)[]
            holdingEntry[1].push.apply(holdingEntry[1], currEntry[1]); // adds FormFields
        }
        else {                                      // default behavior 
            holdingEntry[1] += currEntry[1];        // mutates holdingEntry second value 
        }
    }
    return flatDataset; 
}