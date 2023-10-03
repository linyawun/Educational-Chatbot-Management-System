import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { getDatabase, ref, set, push, update } from 'firebase/database';
import { Input, Select } from '../components/FormElement';
function CourseModal({
  type,
  closeCourseModal,
  getCourses,
  tempCourse,
  formatTime,
}) {
  const db = getDatabase();
  const [user] = useOutletContext();
  const { t } = useTranslation();
  const initData = useMemo(
    () => ({
      name: '',
      week: '',
      startTime: '',
      endTime: '',
      classroom: '',
    }),
    []
  );
  const [tempData, setTempData] = useState(initData);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initData,
    mode: 'onTouched',
  });
  const addCourse = async (courseData) => {
    try {
      const coursesRef = ref(db, 'courses');
      const newCourseRef = push(coursesRef);
      await set(newCourseRef, courseData);
    } catch (error) {
      console.error(error);
    }
  };
  const updateCourse = async (courseId, updatedData) => {
    try {
      const courseRef = ref(db, `courses/${courseId}`);
      await update(courseRef, updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async (data) => {
    const { startTime, endTime } = data;
    if (type === 'edit') {
      updateCourse(tempData.id, {
        ...data,
        startTime: formatTime('toStamp', startTime),
        endTime: formatTime('toStamp', endTime),
      });
    } else if (type === 'create') {
      addCourse({
        ...data,
        userId: user.uid,
        startTime: startTime ? formatTime('toStamp', startTime) : '',
        endTime: endTime ? formatTime('toStamp', endTime) : '',
        chatBotId: nanoid(),
        systemText: '我是一門...課程助教',
      });
    }
    closeCourseModal();
    getCourses();
  };
  useEffect(() => {
    if (type === 'create') {
      setTempData(initData);
    } else if (type === 'edit') {
      const { startTime, endTime } = tempCourse;
      setTempData({
        ...tempCourse,
        startTime: startTime ? formatTime('toLocal', startTime) : '',
        endTime: endTime ? formatTime('toLocal', endTime) : '',
      });
    }
  }, [type, initData, tempCourse, formatTime]);
  useEffect(() => {
    const resetForm = () => {
      reset(tempData);
    };
    resetForm();
  }, [tempData, reset]);
  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id='courseModal'
      aria-labelledby='courseModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content border-dark'>
          <div className='modal-header border-0'>
            <h5 className='modal-title text-primary'>
              {type === 'create' ? t('Create Course') : t('Edit Course')}
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={() => {
                closeCourseModal();
                setTempData({});
              }}
            ></button>
          </div>
          <div className='modal-body'>
            <form onSubmit={handleSubmit(submit)} className='row'>
              {tempCourse.chatBotId && (
                <div className='form-group mb-3'>
                  <Input
                    register={register}
                    errors={errors}
                    id='chatBotId'
                    type='text'
                    labelText='ChatBot ID'
                    placeholder=''
                    rules={{}}
                    disabled={true}
                  />
                </div>
              )}

              <div className='form-group mb-3'>
                <Input
                  register={register}
                  errors={errors}
                  id='name'
                  type='text'
                  labelText={`${t('Course Name')}*`}
                  placeholder=''
                  rules={{
                    required: {
                      value: true,
                      message: t('required'),
                    },
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <Select
                  register={register}
                  errors={errors}
                  labelText={t('Course Week')}
                  id='week'
                  rules={{}}
                  disabled={false}
                >
                  <option value='' disabled></option>
                  <option value='Monday'>{t('Monday')}</option>
                  <option value='Tuesday'>{t('Tuesday')}</option>
                  <option value='Wednesday'>{t('Wednesday')}</option>
                  <option value='Thursday'>{t('Thursday')}</option>
                  <option value='Friday'>{t('Friday')}</option>
                </Select>
              </div>
              <div className='form-group mb-3'>
                <p className='mb-2'>{t('Class Time')}</p>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='col-5 form-group'>
                    <Input
                      register={register}
                      errors={errors}
                      id='startTime'
                      type='time'
                      labelText=''
                      placeholder=''
                      rules={{}}
                    />
                  </div>
                  <hr className='col-1 text-dark' />
                  <div className='col-5 form-group'>
                    <Input
                      register={register}
                      errors={errors}
                      id='endTime'
                      type='time'
                      labelText=''
                      placeholder=''
                      rules={{}}
                    />
                  </div>
                </div>
              </div>
              <div className='form-group mb-3'>
                <Input
                  register={register}
                  errors={errors}
                  id='classroom'
                  type='text'
                  labelText={t('Classroom')}
                  placeholder=''
                  rules={{}}
                />
              </div>
              <div className='modal-footer border-0'>
                <button
                  type='button'
                  className='btn btn-light'
                  data-bs-dismiss='modal'
                  onClick={() => {
                    closeCourseModal();
                    setTempData({});
                  }}
                >
                  {t('Cancel')}
                </button>
                <button type='submit' className='btn btn-primary'>
                  {t('Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseModal;
