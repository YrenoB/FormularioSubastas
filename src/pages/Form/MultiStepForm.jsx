import { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import Swal from 'sweetalert2';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import ProgressBar from './ProgressBar';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import LogoRenobo from '../../assets/logoRenobo.png';
import './MultiStepForm.css';

export default function MultiStepForm() {
  const SMMLV_DEFAULT = 1423500;

  const {
    register,
    control,
    watch, 
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      razonSocial: '',
      nit: '',
      domicilio: '',
      representante: '',
      cedulaRep: '',
      direccionNotificacion: '',
      telefono: '',
      garantiaMonto: '',
      instrumentoTipo: '',
      entidadEmisora: '',
      instrumentoNumero: '',
      fechaExpedicion: '',
      vigenciaInstrumento: '',
      proyectos: [{ numero: 1, nombre: '', ubicacion: '', tamano: '', estado: '' }],
      acepta: false,
      firmaNombre: '',
      firmaFecha: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "proyectos"
  });

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append all text fields
      Object.keys(data).forEach(key => {
        if (key === "proyectos") {
          formData.append(key, JSON.stringify(data[key])); // Stringify projects array
        } else if (
            key !== "certificadoExistencia" &&
            key !== "estadosFinancieros" &&
            key !== "autorizacionSubasta" &&
            key !== "sarlaft" &&
            key !== "formFileSign"
        ) {
          formData.append(key, data[key]);
        }
      });

      // Append files
      if (data.certificadoExistencia?.[0])
        formData.append("certificadoExistencia", data.certificadoExistencia[0]);
      if (data.estadosFinancieros?.[0])
        formData.append("estadosFinancieros", data.estadosFinancieros[0]);
      if (data.autorizacionSubasta?.[0])
        formData.append("autorizacionSubasta", data.autorizacionSubasta[0]);
      if (data.sarlaft?.[0])
        formData.append("sarlaft", data.sarlaft[0]);
      if (data.formFileSign?.[0])
        formData.append("formFileSign", data.formFileSign[0]);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log("Formulario enviado exitosamente:", result);
      Swal.fire({
        title: '¡Formulario enviado!',
        text: 'Tu información ha sido registrada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#AFE951',
      });
    } catch (error) {
      console.error("Error al enviar formulario:", error);

      Swal.fire({
        title: 'Error al enviar el formulario',
        text: 'Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#FE525E',
      });
    }
  };


  return (
    <>
      <div className="divLog">
        <a href="https://renobo.com.co/" target="_blank" rel="noopener noreferrer">
          <img src={LogoRenobo} className="img-fluid divLog-img" alt="logoRenobo" />
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-fluid py-4">
          <AnimatePresence mode="wait">
            <Motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
            >

              {/* CARD PRINCIPAL */}
              <div className="card cardPpal">
                <div className="card-body cardBodyPpal">

                  {/* BARRA DE PROGRESO DENTRO DEL CARD */}
                  <Motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-4"
                  >
                    <ProgressBar step={step} total={totalSteps} />
                  </Motion.div>

                  {/* CONTENIDO DEL STEP */}
                  {step === 1 && <FormStep1 register={register} errors={errors} handleSubmit={handleSubmit} next={next} />}
                  {step === 2 && <FormStep2 register={register} errors={errors} control={control} handleSubmit={handleSubmit} next={next} back={back} />}
                  {step === 3 && <FormStep3 register={register} errors={errors} fields={fields} append={append} remove={remove} handleSubmit={handleSubmit} next={next} back={back} />}
                  {step === 4 && <FormStep4 register={register} watch={watch} setValue={setValue} errors={errors} back={back} onSubmitFinal={handleSubmit(onSubmit)} />}
                
                </div>
              </div>

            </Motion.div>
          </AnimatePresence>
        </div>
      </form>
    </>
  );
}