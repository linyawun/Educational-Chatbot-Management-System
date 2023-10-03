import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, CheckboxRadio } from '../components/FormElement';
import { getDatabase, ref, push, set, update } from 'firebase/database';

function UnitModal({ courseId, type, closeUnitModal, getUnits, tempUnit }) {
  const [user] = useOutletContext();
  const db = getDatabase();
  const { t } = useTranslation();
  const initData = useMemo(
    () => ({
      name: '',
      pdfFile: '',
      visible: false,
    }),
    []
  );
  const [tempData, setTempData] = useState(initData);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initData,
    mode: 'onTouched',
  });
  const [fileName, setFileName] = useState('');
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      setFileName(file.name);
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
  };
  const addUnit = async (courseId, unitData) => {
    try {
      const unitsRef = ref(db, 'units');
      const newUnitRef = push(unitsRef);
      await set(newUnitRef, { ...unitData, courseId });
    } catch (error) {
      console.error(error);
    }
  };
  const updateUnit = async (unitId, updatedData) => {
    try {
      const unitRef = ref(db, `units/${unitId}`);
      await update(unitRef, updatedData);

      console.log('單元資料已成功更新！');
    } catch (error) {
      console.error('更新單元資料時發生錯誤:', error);
    }
  };

  const submit = async (data) => {
    const csvFile = fileName ? `${fileName.split('.')[0]}_embedding.csv` : '';
    if (type === 'edit') {
      updateUnit(tempData.id, {
        ...data,
        pdfFile: fileName,
        csvFile: csvFile,
      });
    } else if (type === 'add') {
      addUnit(courseId, {
        ...data,
        userId: user.uid,
        pdfFile: fileName,
        csvFile: csvFile,
      });
    }
    closeUnitModal();
    getUnits(courseId);
  };

  useEffect(() => {
    if (type === 'add') {
      setTempData(initData);
      setFileName('');
    } else if (type === 'edit') {
      setTempData({
        ...tempUnit,
      });
      setFileName(tempUnit.pdfFile);
    }
  }, [initData, tempUnit, type]);

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
      id='unitModal'
      aria-labelledby='unitModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content border-dark'>
          <div className='modal-header border-0'>
            <h5 className='modal-title text-primary'>
              {type === 'add' ? t('Add Unit') : t('Edit Unit')}
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={() => {
                closeUnitModal();
                setTempData({});
              }}
            ></button>
          </div>
          <div className='modal-body'>
            <form onSubmit={handleSubmit(submit)} className='row'>
              <div className='form-group mb-3'>
                <Input
                  register={register}
                  errors={errors}
                  id='name'
                  type='text'
                  labelText={`${t('Unit Name (Menu Name)')}*`}
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
                <p className='mb-2'>{t('Upload PDF')}</p>
                <div className='d-flex align-items-stretched mb-1'>
                  <label className='btn btn-light w-25 border-light-grey d-flex align-items-center justify-content-center'>
                    <input
                      {...register('pdfFile')}
                      type='file'
                      onChange={handleFileChange}
                    />
                    {t('Select file')}
                  </label>
                  <p className='mb-0 bg-light w-75 d-flex align-items-center ps-2'>
                    {fileName}
                  </p>
                </div>
                {fileName && (
                  <p className='mb-0'>
                    <small>
                      {t('Has been converted to')}{' '}
                      <span className='text-primary'>{`${
                        fileName.split('.')[0]
                      }_embedding.csv`}</span>
                    </small>
                  </p>
                )}
              </div>
              {fileName && (
                <div className='form-group mb-3'>
                  <CheckboxRadio
                    register={register}
                    errors={errors}
                    type='checkbox'
                    name='visible'
                    id='visible'
                    value={true}
                    rules={{}}
                    labelText={t('Visible in Menu')}
                    hasErrorMsg={false}
                  />
                </div>
              )}

              <div className='modal-footer border-0'>
                <button
                  type='button'
                  className='btn btn-light'
                  data-bs-dismiss='modal'
                  onClick={() => {
                    closeUnitModal();
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

export default UnitModal;
