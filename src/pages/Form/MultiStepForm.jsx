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
    console.log("Datos del formulario:", data);
    
    // Campos simples
    Object.keys(data).forEach(key => {
      if (key !== "proyectos" && !key.startsWith("formFile")) {
        formData.append(key, data[key] || '');
      }
    });

    // Proyectos como JSON
    formData.append("proyectos", JSON.stringify(data.proyectos));

    // Archivos
    ["certificadoExistencia", "estadosFinancieros", "autorizacionSubasta", "sarlaft"].forEach(key => {
      if (data[key]?.[0]) {
        formData.append(key, data[key][0]);
      }
    });

    try {
      // Usar un iframe para enviar el formulario y mostrar la respuesta HTML con el error
      return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.name = 'form_submit_' + Date.now();
        iframe.style.position = 'fixed';
        iframe.style.top = '50%';
        iframe.style.left = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
        iframe.style.width = '80%';
        iframe.style.height = '80%';
        iframe.style.border = '2px solid #333';
        iframe.style.borderRadius = '8px';
        iframe.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        iframe.style.zIndex = '10000';
        iframe.style.backgroundColor = 'white';
        document.body.appendChild(iframe);

        // Crear formulario HTML
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbx2KksJUw5RrnyAJek8nWZBe_CqlgScFi1R1W_igpWnuqj4io1irqL_MWvWF4E_id-M/exec';
        form.target = iframe.name;
        form.enctype = 'multipart/form-data';
        form.style.display = 'none';

        // Agregar todos los datos del FormData al formulario HTML
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            // Para archivos, usar DataTransfer
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = key;
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(value);
            fileInput.files = dataTransfer.files;
            form.appendChild(fileInput);
          } else {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }
        }

        // Botón para cerrar el iframe
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Cerrar';
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = '10%';
        closeBtn.style.right = '10%';
        closeBtn.style.zIndex = '10001';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.backgroundColor = '#f44336';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => {
          document.body.removeChild(iframe);
          document.body.removeChild(form);
          if (document.body.contains(closeBtn)) {
            document.body.removeChild(closeBtn);
          }
        };
        document.body.appendChild(closeBtn);

        iframe.onload = function() {
          // Intentar leer la respuesta del iframe
          setTimeout(() => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc) {
                // Buscar el JSON en la respuesta
                const preElement = iframeDoc.getElementById('response');
                if (preElement) {
                  try {
                    const json = JSON.parse(preElement.textContent);
                    console.log("Respuesta del servidor:", json);
                    
                    if (json.status === "OK") {
                      alert("✅ Formulario enviado correctamente!");
                      document.body.removeChild(iframe);
                      document.body.removeChild(form);
                      if (document.body.contains(closeBtn)) {
                        document.body.removeChild(closeBtn);
                      }
                      resolve(json);
                    } else if (json.error) {
                      // El error ya se muestra en el HTML del iframe
                      console.error("Error del servidor:", json.error);
                      // No cerrar el iframe para que el usuario vea el error
                    }
                  } catch (e) {
                    console.log("No se pudo parsear JSON, pero la respuesta se muestra en el iframe");
                  }
                } else {
                  // Si no hay elemento response, la respuesta puede estar en el body
                  const bodyText = iframeDoc.body?.innerText || iframeDoc.body?.textContent || '';
                  if (bodyText.includes('ERROR') || bodyText.includes('ÉXITO')) {
                    // La respuesta HTML se está mostrando, no hacer nada más
                    console.log("Respuesta HTML visible en el iframe");
                  }
                }
              }
            } catch (e) {
              // CORS bloquea el acceso, pero el iframe debería mostrar la respuesta
              console.log("No se puede acceder al contenido del iframe (CORS), pero la respuesta debería verse en el iframe");
              
              // Esperar un poco más y mostrar un mensaje al usuario
              setTimeout(() => {
                // Verificar si el iframe tiene contenido visible
                const iframeVisible = iframe.offsetWidth > 0 && iframe.offsetHeight > 0;
                if (iframeVisible) {
                  // El iframe está visible, probablemente muestra la respuesta
                  console.log("El iframe está visible, revisa la respuesta dentro del iframe");
                }
              }, 2000);
            }
          }, 1500);
        };
        
        // Manejar errores de carga del iframe
        iframe.onerror = function() {
          console.error("Error al cargar el iframe");
          alert("Error al enviar el formulario. Por favor, verifica tu conexión e intenta nuevamente.");
          document.body.removeChild(iframe);
          document.body.removeChild(form);
          if (document.body.contains(closeBtn)) {
            document.body.removeChild(closeBtn);
          }
          reject(new Error("Error al cargar el iframe"));
        };

        document.body.appendChild(form);
        form.submit();
      });
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Error al enviar el formulario: " + error.message + "\n\nPor favor, intenta nuevamente o verifica tu conexión a internet.");
      throw error;
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