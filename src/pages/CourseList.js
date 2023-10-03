import { useRef, useEffect, useState, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  getDatabase,
  ref,
  get,
  orderByChild,
  equalTo,
  remove,
  query,
} from 'firebase/database';
import { useTranslation } from 'react-i18next';
import { Modal } from 'bootstrap';
import CourseModal from '../components/CourseModal';

function CourseList() {
  const db = getDatabase();
  const [user] = useOutletContext();
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [type, setType] = useState('create');
  const [tempCourse, setTempCourse] = useState({});
  const courseModal = useRef(null);
  const formatTime = (type, time) => {
    if (!time) {
      return '';
    }
    if (type === 'toLocal') {
      const date = new Date(time * 1000);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours < 10 ? '0' + hours : hours;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

      const timeFormat = formattedHours + ':' + formattedMinutes;
      return timeFormat;
    } else if (type === 'toStamp') {
      let timeParts = time.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      // 取得時間戳 (以毫秒為單位)
      const timestamp = Math.floor(date.getTime() / 1000);
      return timestamp;
    }
  };
  const getCourses = useCallback(async () => {
    try {
      const db = getDatabase();
      const coursesRef = ref(db, 'courses');
      const coursesQuery = query(
        coursesRef,
        orderByChild('userId'),
        equalTo(user.uid)
      );
      const snapshot = await get(coursesQuery);
      const coursesArray = [];
      if (snapshot.exists()) {
        snapshot.forEach((courseSnapshot) => {
          const courseId = courseSnapshot.key;
          const courseData = courseSnapshot.val();
          coursesArray.push({ id: courseId, ...courseData });
        });
      }
      setCourses(coursesArray);
    } catch (error) {
      console.error('讀取資料時發生錯誤:', error);
    }
  }, [user]);

  const deleteCourse = async (courseId) => {
    try {
      const courseRef = ref(db, `courses/${courseId}`);

      await remove(courseRef);
      getCourses();
    } catch (error) {
      console.error(error);
    }
  };
  const openCourseModal = (type, course) => {
    setType(type);
    setTempCourse(course);
    courseModal.current.show();
  };

  const closeCourseModal = () => {
    courseModal.current.hide();
    setTempCourse({});
  };

  useEffect(() => {
    getCourses();
    courseModal.current = new Modal('#courseModal', {
      backdrop: 'static',
    });
  }, [getCourses]);

  return (
    <div className='container container-vh'>
      <CourseModal
        type={type}
        closeCourseModal={closeCourseModal}
        getCourses={getCourses}
        tempCourse={tempCourse}
        formatTime={formatTime}
      />
      <div className='d-flex justify-content-between align-items-center my-4'>
        <h2 className='text-primary'>{t('Course List')}</h2>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => {
            openCourseModal('create', {});
          }}
        >
          {t('Create Course')}
        </button>
      </div>
      <div className='row align-items-stretch'>
        {courses.length > 0 ? (
          courses.map((course) => {
            const { id, name, week, startTime, endTime, classroom } = course;
            return (
              <div className='col-lg-6 col-12 mb-4' key={id}>
                <div className='card rounded course-card h-100'>
                  <div className='card-header bg-transparent border-0 pt-4 pb-3'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <Link
                        to={`/user/courseContent/${id}`}
                        className='link stretched-link'
                      >
                        <h5 className='card-title'>{name}</h5>
                      </Link>
                      <div className='dropdown'>
                        <button
                          type='button'
                          className='btn rounded-circle border-0 btn-icon d-flex justify-content-center align-items-center fs-5'
                          data-bs-toggle='dropdown'
                          aria-expanded='false'
                        >
                          <i className='bi bi-three-dots-vertical'></i>
                        </button>
                        <ul className='dropdown-menu'>
                          <li>
                            <button
                              className='dropdown-item'
                              onClick={() => {
                                openCourseModal('edit', course);
                              }}
                            >
                              <i className='bi bi-pencil-square me-1'></i>
                              {t('Edit')}
                            </button>
                          </li>
                          <li>
                            <button
                              className='dropdown-item'
                              onClick={() => {
                                deleteCourse(course.id);
                              }}
                            >
                              <i className='bi bi-trash3-fill me-1'></i>
                              {t('Delete')}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p className='card-header-border mb-0 mt-3'></p>
                  </div>
                  <div className='card-body pt-0 py-4'>
                    {week || (startTime && endTime) ? (
                      <p className='card-text mb-0'>
                        {t('Class Time')}: {week}{' '}
                        {startTime
                          ? `${formatTime('toLocal', startTime)} - `
                          : ''}
                        {endTime ? formatTime('toLocal', endTime) : ''}
                      </p>
                    ) : (
                      ''
                    )}
                    {classroom && (
                      <p className='card-text'>
                        {t('Classroom')}: {classroom}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h4 className='text-light-grey'> {t('No courses now')}</h4>
        )}
      </div>
    </div>
  );
}
export default CourseList;
