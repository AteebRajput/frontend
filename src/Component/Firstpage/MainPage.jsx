import GetStarted from './GetStarted/GetStarted';
import KeyFeature from './KeyFeature/KeyFeature';
import LandingPage from './LandingPage/LandingPage'
import './MainPage.css'
import Navbar from './Navbar/Navbar'
import OurSolution from './OurSolution/OurSolution'
import Workflow from './Workflow/Workflow';

function MainPage() {
  return (
    <>
      <div className='main'>
        <div className='navbar-container'>
          <Navbar />
        </div>
        <div className='landing-page-container'>
          <LandingPage />
        </div>
        <div className='solution-container'>
          <OurSolution />
        </div>
        <div className="get-started">
          <GetStarted />
        </div>
        <div className="workflow">
          <Workflow />
        </div>
        <div className="key-feature-container">
          <KeyFeature />
        </div>
      </div>
    </>
  );
}

export default MainPage;
