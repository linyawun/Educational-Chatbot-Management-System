import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  getDatabase,
  ref,
  get,
  query,
  remove,
  update,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { FormErrorMsg } from '../components/FormElement';
import UnitModal from '../components/UnitModal';
function CourseContent() {
  const { t } = useTranslation();
  const db = getDatabase();
  const navigate = useNavigate();
  const [editSystemTxt, setEditSystemTxt] = useState(false);
  const [course, setCourse] = useState({});
  const [units, setUnits] = useState([]);
  const [tempUnit, setTempUnit] = useState({});
  const { courseId } = useParams();
  const unitModal = useRef(null);
  const initData = useRef({
    systemText: '',
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initData.current,
    mode: 'onTouched',
  });
  const [type, setType] = useState('add');
  const updateCourse = async (courseId, updatedData) => {
    try {
      const courseRef = ref(db, `courses/${courseId}`);
      await update(courseRef, updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async (data) => {
    setEditSystemTxt(false);
    updateCourse(courseId, data);

    getCourse(courseId);
  };

  const openUnitModal = (type, unit) => {
    setType(type);
    setTempUnit(unit);
    unitModal.current.show();
  };

  const closeUnitModal = () => {
    setTempUnit({});
    unitModal.current.hide();
  };

  const deleteUnit = async (unitId) => {
    try {
      const unitRef = ref(db, `units/${unitId}`);
      await remove(unitRef);
      getUnits(courseId);
    } catch (error) {
      console.error(error);
    }
  };

  const getUnits = useCallback(
    async (courseId) => {
      try {
        const unitsRef = ref(db, 'units');
        const unitsQuery = query(
          unitsRef,
          orderByChild('courseId'),
          equalTo(courseId)
        );
        const snapshot = await get(unitsQuery);
        const unitsArray = [];
        if (snapshot.exists()) {
          snapshot.forEach((unitSnapshot) => {
            const unitData = unitSnapshot.val();
            unitsArray.push({ id: unitSnapshot.key, ...unitData });
          });
        }
        setUnits(unitsArray);
      } catch (error) {
        console.error('讀取單元資料時發生錯誤:', error);
        navigate('/');
      }
    },
    [navigate, db]
  );

  const getCourse = useCallback(
    async (courseId) => {
      try {
        const courseRef = ref(db, `courses/${courseId}`);
        const snapshot = await get(courseRef);
        if (snapshot.exists()) {
          const courseData = snapshot.val();
          setCourse(courseData);
        }
      } catch (error) {
        console.error('讀取資料時發生錯誤:', error);
      }
    },
    [db]
  );

  useEffect(() => {
    getCourse(courseId);
    getUnits(courseId);
    unitModal.current = new Modal('#unitModal', {
      backdrop: 'static',
    });
  }, [getUnits, getCourse, courseId]);

  useEffect(() => {
    const resetForm = () => {
      reset(course);
    };
    resetForm();
  }, [course, reset]);
  return (
    <div className='container container-vh'>
      <UnitModal
        courseId={courseId}
        type={type}
        closeUnitModal={closeUnitModal}
        getUnits={getUnits}
        tempUnit={tempUnit}
      />
      <h2 className='text-primary my-4'>{t('Course Content Setting')}</h2>
      <h5 className='fw-normal mb-4'>
        {t('Course Name')}: {course.name}
      </h5>
      <form onSubmit={handleSubmit(submit)} className='mb-5'>
        <div className='form-group mb-3'>
          <label
            htmlFor='systemText'
            className='form-label d-flex align-items-center fs-5 '
          >
            {t('System Text')}
            <button
              type='button'
              className='btn btn-icon border-0 rounded-circle d-flex justify-content-center align-items-center fs-5 ms-2 text-primary'
              disabled={editSystemTxt}
              onClick={() => {
                setEditSystemTxt(true);
              }}
            >
              <i className='bi bi-pencil-square'></i>
            </button>
          </label>
          <input
            id='systemText'
            type='text'
            className={`form-control bg-light ${
              errors['systemText'] ? 'is-invalid' : ''
            }`}
            {...register('systemText', {
              required: {
                value: true,
                message: t('required'),
              },
            })}
            disabled={!editSystemTxt}
          />
          <FormErrorMsg errors={errors} name='systemText' />
        </div>
        {editSystemTxt && (
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              className='btn btn-light me-3'
              onClick={() => {
                reset(course);
                setEditSystemTxt(false);
              }}
            >
              {t('Cancel')}
            </button>
            <button type='submit' className='btn btn-primary'>
              {t('Save')}
            </button>
          </div>
        )}
      </form>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <p className='fs-5 mb-0'>{t('Course Unit')}</p>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => openUnitModal('add', {})}
        >
          {t('Add Unit')}
        </button>
      </div>
      <div className='table-responsive'>
        <table className='table align-middle'>
          <thead className='table-light'>
            <tr>
              <th scope='col'>{t('Unit Name (Menu Name)')}</th>
              <th scope='col'>{t('Coverted')}</th>
              <th scope='col'>{t('Visible in Menu')}</th>
              <th scope='col'>{t('Edit')}</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => {
              return (
                <tr key={unit.id}>
                  <td>{unit.name}</td>
                  <td>
                    {unit.csvFile ? (
                      <i className='bi bi-check-square-fill'></i>
                    ) : (
                      <i className='bi bi-square'></i>
                    )}
                  </td>
                  <td>
                    {unit.visible ? (
                      <i className='bi bi-check-square-fill'></i>
                    ) : (
                      <i className='bi bi-square'></i>
                    )}
                  </td>
                  <td>
                    <div className='d-flex gap-2'>
                      <button
                        type='button'
                        className='btn btn-primary btn-sm'
                        onClick={() => openUnitModal('edit', unit)}
                      >
                        {t('Edit')}
                      </button>
                      <button
                        type='button'
                        className='btn btn-outline-danger btn-sm'
                        onClick={() => {
                          deleteUnit(unit.id);
                        }}
                      >
                        {t('Delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseContent;
