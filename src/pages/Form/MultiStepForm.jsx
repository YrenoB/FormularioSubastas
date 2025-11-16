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
      smmlv: SMMLV_DEFAULT,
      garantiaMonto: '',
      instrumentoTipo: '',
      entidadEmisora: '',
      instrumentoNumero: '',
      fechaExpedicion: null,
      vigenciaInstrumento: null,
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
    const formData = new FormData();
    console.log("antes", data);
    // Campos simples
    Object.keys(data).forEach(key => {
      if (key !== "proyectos" && !key.startsWith("formFile")) {
        formData.append(key, data[key]);
      }
    });

    // Proyectos como JSON
    formData.append("proyectos", JSON.stringify(data.proyectos));

    // Archivos
    ["certificadoExistencia", "estadosFinancieros", "autorizacionSubasta", "sarlaft"].forEach(key => {
      if (data[key]?.[0]) formData.append(key, data[key][0]);
    });

    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbz8JrFllt6FPMKulkr91eNs8Hn_h-2iKOltGDyQ_V-3zUBHe0V59L04rv7n2xExi2r1/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();
    console.log(json);

    if (json.status === "OK") {
      alert("Formulario enviado correctamente");
    } else {
      alert("Error: " + json.error);
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