import { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import ProgressBar from './ProgressBar';
import { AnimatePresence, motion } from 'framer-motion';
import LogoRenobo from '../../assets/logoRenobo.png';
import './MultiStepForm.css';

export default function MultiStepForm() {
  const SMMLV_DEFAULT = 1423500;

  const {
    register,
    control,
    handleSubmit,
    watch,
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
      // --- 1️⃣ Enviar datos planos ---
      const formDataPlain = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== "proyectos" &&
            key !== "certificadoExistencia" &&
            key !== "estadosFinancieros" &&
            key !== "autorizacionSubasta" &&
            key !== "sarlaft") {
          formDataPlain.append(key, data[key]);
        }
      });

      const resPlain = await fetch("https://script.google.com/macros/s/AKfycbyzQOLQ6MWJSnrpvFWbDPTQquQ6uP3I2au3IE3hAoeQqS9HEQ9nk1TUtJW_7h3H05ye/exec", {
        method: "POST",
        body: formDataPlain
      });
      const resultPlain = await resPlain.json();
      console.log("Respuestas guardadas:", resultPlain);

      // --- 2️⃣ Enviar proyectos + archivos ---
      const formDataProjects = new FormData();
      formDataProjects.append("email", data.email);
      formDataProjects.append("proyectos", JSON.stringify(data.proyectos));

      if (data.certificadoExistencia?.[0])
        formDataProjects.append("certificadoExistencia", data.certificadoExistencia[0]);
      if (data.estadosFinancieros?.[0])
        formDataProjects.append("estadosFinancieros", data.estadosFinancieros[0]);
      if (data.autorizacionSubasta?.[0])
        formDataProjects.append("autorizacionSubasta", data.autorizacionSubasta[0]);
      if (data.sarlaft?.[0])
        formDataProjects.append("sarlaft", data.sarlaft[0]);

      const resProjects = await fetch("https://script.google.com/macros/s/AKfycbyQgu9TTK098LgnmniwLQq3lSt_XAvy7CBBSuKinjh_NIO0JNY-rxzg__lvtc75vs6_/exec", {
        method: "POST",
        body: formDataProjects
      });
      const resultProjects = await resProjects.json();
      console.log("Proyectos y archivos guardados:", resultProjects);

    } catch (error) {
      console.error("Error al enviar formulario:", error);
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
            <motion.div
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
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-4"
                  >
                    <ProgressBar step={step} total={totalSteps} />
                  </motion.div>

                  {/* CONTENIDO DEL STEP */}
                  {step === 1 && <FormStep1 register={register} errors={errors} handleSubmit={handleSubmit} next={next} />}
                  {step === 2 && <FormStep2 register={register} errors={errors} control={control} handleSubmit={handleSubmit} next={next} back={back} />}
                  {step === 3 && <FormStep3 register={register} errors={errors} fields={fields} append={append} remove={remove} handleSubmit={handleSubmit} next={next} back={back} />}
                  {step === 4 && <FormStep4 register={register} errors={errors} back={back} onSubmitFinal={handleSubmit(onSubmit)} />}
                
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </form>
    </>
  );
}