import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseContent from './pages/CourseContent';
import Dashboard from './pages/Dashboard';
import UserAccount from './pages/UserAccount';
import database from './utils/firebase';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Home />}></Route>
        </Route>
        <Route path='/user' element={<Dashboard />}>
          <Route path='userAccount' element={<UserAccount />}></Route>
          <Route path='courseList' element={<CourseList />}></Route>
          <Route
            path='courseContent/:courseId'
            element={<CourseContent />}
          ></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
