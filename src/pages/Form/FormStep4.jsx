import { FaLongArrowAltLeft, FaCheck } from 'react-icons/fa';

export default function FormStep4({ register, errors, back, onSubmitFinal }) {
  return (
    <>
      <div className="borderGreen rounded-4 mb-3 p-4">
        <h4>IV. DECLARACIONES Y ACEPTACIÓN</h4>

        <p>El proponente, bajo la gravedad de juramento, declara:</p>
        <ul>
          <li>Que los datos e información contenidos en este formato son veraces y susceptibles de verificación.</li>
          <li>Que ha leído y acepta la totalidad de los términos, condiciones y procedimientos establecidos en el reglamento de la subasta, incluyendo el requisito de 
            constituir la Garantía de Seriedad de la Oferta como respaldo del proceso de subasta.</li>
          <li>Que conoce que el incumplimiento en el pago de los certificados adjudicados dará lugar a la ejecución de la 
            Garantía de Seriedad de la Oferta, sin perjuicio de las acciones legales adicionales a que haya lugar y conllevará, además, la inhabilitación del 
            proponente para participar en las siguientes subastas del instrumento.
          </li>
        </ul>
        

        <div className="form-check mb-3 custom-check">
          <input id="acepta" className={`form-check-input ${errors.acepta ? 'is-invalid' : ''}`} type="checkbox" {...register('acepta', { required: 'Debe aceptar los términos y condiciones' })} />
          <label className="form-check-label" htmlFor="acepta">
            Declaro bajo la gravedad de juramento que los datos son veraces y que acepto los términos y condiciones de la subasta.
          </label>
          <div className="invalid-feedback">{errors.acepta?.message}</div>
        </div>
      </div>

      <div className="borderGreen rounded-4 mb-3 p-4">
        <h4>V. ANEXOS</h4>

        <p>
          Se adjuntan, como Anexos al presente formato de inscripción, 
          los documentos que respaldan la información diligenciada en 
          los numerales: 
          <br /><br />
          I. “INFORMACIÓN LEGAL Y DE CONTACTO DEL PROPONENTE”, <br />
          II. “REQUISITOS FINANCIEROS Y DOCUMENTACIÓN LEGAL” <br />
          y III. “JUSTIFICACIÓN Y DESCRIPCIÓN DE PROYECTOS”
          <br /><br />
          del presente documento.
        </p>

        <div className="mb-3">
          <label htmlFor="formFileSign" className="form-label">Firma del Representante Legal *</label>
          <input
            className={`form-control ${errors.formFileSign ? 'is-invalid' : ''}`}
            type="file"
            id="formFileSign"
            accept=".pdf,.xls,.xlsx"
            {...register("formFileSign", {
              required: "La firma es obligatoria",
              validate: {
                checkFileType: (value) => {
                  const file = value?.[0];
                  if (!file) return "Debe adjuntar un archivo";
                  const allowedTypes = ["application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
                  if (!allowedTypes.includes(file.type)) return "Formato no permitido. Solo PDF, XLS o XLSX";
                  return true;
                },
                checkFileSize: (value) => {
                  const file = value?.[0];
                  if (!file) return "Debe adjuntar un archivo";
                  const maxSize = 60 * 1024 * 1024; // 60MB
                  if (file.size > maxSize) return "El archivo no debe superar los 60MB";
                  return true;
                },
              },
            })}
          />
          <div className="invalid-feedback">{errors.formFileSign?.message}</div>
        </div>

        <div className="col-md-12">
          <label className="form-label">Nombre completo del Representante Legal *</label>
            <input
              type="text"
              className={`form-control ${errors.firmaNombre ? 'is-invalid' : ''}`}
              {...register('firmaNombre', {
                required: 'Nombre del Representante Legal obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                validate: (v) => (/[<>]/.test(v) ? 'Contiene caracteres inválidos' : true),
              })}
            />
            <div className="invalid-feedback">{errors.firmaNombre?.message}</div>
        </div>
        
        <div className="col-md-12">
          <label className="form-label">Fecha de Diligenciamiento </label>
          <input
            type="text"
            className={`form-control ${errors.firmaFecha ? 'is-invalid' : ''}`}
            readOnly
            value={new Date().toLocaleDateString("es-CO")}
            {...register("firmaFecha", {
              required: "La fecha de diligenciamiento es obligatoria",
            })}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <button className="btn buttonsBack" onClick={back}>
          <FaLongArrowAltLeft /> Atrás
        </button>

        <button type="submit" className="btn buttons" onClick={onSubmitFinal} >
          Enviar formulario <FaCheck />
        </button>
      </div>
    </>
  );
}