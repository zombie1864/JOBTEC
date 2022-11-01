import React from 'react';
import JobTrackerComp from './components/jobTracker/JobTrackerComp';

function App() {
  /**
  @description: This fn serves as `__main__` in other languages. Here you add all your comp relevent to 
  the app. You can also add logic to switch between `pages` of your app. Since React is a "SPA" 
  (Single Page Application), all the comp mounted onto the DOM will relate to what is being displayed 
  on the current page. To switch between pages will require routes to be added along with `page` 
  specific components that contain all relevant comp to that page. 
  **/
  return (
    <div className="App">
      <JobTrackerComp />
    </div>
  );
}

export default App;
