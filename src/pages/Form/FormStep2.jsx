import DatePicker from "react-datepicker";
import { Controller, useWatch } from "react-hook-form";
import { FaLongArrowAltLeft, FaLongArrowAltRight  } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import { Placeholder } from "react-bootstrap";

export default function FormStep2({ register, errors, control, handleSubmit, next, back, }) {
  const SMMLV_DEFAULT = 1423500;
  const GARANTIA_FACTOR = 150;
  const garantiaMinima = SMMLV_DEFAULT * GARANTIA_FACTOR;
  
  const watchFechaExp = useWatch({
    control,
    name: "fechaExpedicion",
  });

  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const validateFileType = (value) => {
    const file = value?.[0];
    if (!file) return "Debe adjuntar un archivo";

    if (!allowedTypes.includes(file.type)) {
      return "Formato no permitido. Solo PDF, XLS o XLSX";
    }
    return true;
  };

  const validateFileSize = (value) => {
    const file = value?.[0];
    if (!file) return "Debe adjuntar un archivo";

    const maxSize = 60 * 1024 * 1024; // 60MB
    if (file.size > maxSize) {
      return "El archivo no debe superar los 60MB";
    }
    return true;
  };

  const onValid = () => next();

  return (
    <>
      <h4>II. REQUISITOS FINANCIEROS Y DOCUMENTACIÓN LEGAL</h4>

      <br />
      <p className="text-muted small">
        Al adjuntar los documentos requeridos, tenga en cuenta que todos los archivos deben estar en formato <strong>PDF, XLS o XLSX</strong> y no deben superar un tamaño máximo de <strong>60 MB</strong>.
      </p>
      <div className="borderGreen rounded-4 mb-3 p-4">
        <h5 className="text-muted">A. Documentación Obligatoria</h5>
        <p>
          El proponente deberá aportar la siguiente documentación, de carácter obligatorio, para efectos de la verificación de su existencia y representación legal y solvencia económica:
        </p>

        <div className="mb-3">
          <label htmlFor="certificadoExistencia" className="form-label"><strong>Certificado de Existencia y Representación Legal *</strong></label>
          <p className="text-muted small">Expedido con una antelación no mayor a treinta (30) días calendario a la fecha de cierre de la inscripción. 
            Debe acreditarse que el representante legal del proponente tenga facultades para poder presentarse a la subasta 
            o allegar el documento del órgano competente de la persona jurídica correspondiente que ostente dichas facultades.
          </p>
          <input
            className={`form-control ${errors.certificadoExistencia ? 'is-invalid' : ''}`}
            type="file"
            id="certificadoExistencia"
            accept=".pdf,.xls,.xlsx"
            {...register("certificadoExistencia", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />

          <div className="invalid-feedback">{errors.certificadoExistencia?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="estadosFinancieros" className="form-label"><strong>Estados Financieros Auditados *</strong></label>
          <p className="text-muted small">
            Últimos estados financieros auditados disponibles (cierre fiscal último año)
          </p>
          <input
            className={`form-control ${errors.estadosFinancieros ? 'is-invalid' : ''}`}
            type="file"
            id="estadosFinancieros"
            accept=".pdf,.xls,.xlsx"
            {...register("estadosFinancieros", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />
          <div className="invalid-feedback">{errors.estadosFinancieros?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="autorizacionSubasta" className="form-label"><strong>Autorización para participar en la Subasta *</strong></label>
          <p className="text-muted small">El representante legal deberá contar con la autorización expresa del órgano competente, 
            otorgada conforme a lo dispuesto en los estatutos sociales de la respectiva empresa, cuando sus facultades de representación 
            estén sujetas a límites de cuantía o a la aprobación previa de la junta directiva o del órgano decisorio correspondiente, 
            para efectuar la compra de los certificados de derechos de construcción y desarrollo en la subasta.
          </p>
          <input
            className={`form-control ${errors.autorizacionSubasta ? 'is-invalid' : ''}`}
            type="file"
            id="autorizacionSubasta"
            accept=".pdf,.xls,.xlsx"
            {...register("autorizacionSubasta", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />

          <div className="invalid-feedback">{errors.autorizacionSubasta?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="sarlaft" className="form-label"><strong>Documentación que respalde la verificación de SARLAFT *</strong></label>
          <p className="text-muted small">Previa instrucción de la Sociedad Fiduciaria designada para tal efecto, la Empresa de Renovación 
            y Desarrollo Urbano de Bogotá D.C., le solicitará al proponente adjuntar los soportes y documentos que certifiquen la aprobación 
            del proceso de SARLAFT.
          </p>
          <input
            className={`form-control ${errors.sarlaft ? 'is-invalid' : ''}`}
            type="file"
            id="sarlaft"
            accept=".pdf,.xls,.xlsx"
            {...register("sarlaft", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />

          <div className="invalid-feedback">{errors.sarlaft?.message}</div>
        </div>
      </div>

      <div className="borderGreen rounded-4 mb-3 p-4">
        <h5 className="text-muted">B. Garantía de Seriedad de la Oferta</h5>
        <p>
          El proponente debe constituir una Garantía de Seriedad de la Oferta, 
          en los términos y condiciones previstos en el reglamento de la subasta, 
          con el objeto de respaldar el cumplimiento íntegro y oportuno de las obligaciones 
          asumidas en virtud de la oferta presentada.
        </p>
        
        <div className="row gx-3 gy-2">
          <div className="col-md-12">
            <label className="form-label">Monto de la Garantía (COP) *</label>
            <p className="text-muted small"> El valor de la garantía debe ser equivalente a ciento 
              cincuenta {GARANTIA_FACTOR} (ciento cincuenta) Salarios Mínimos Mensuales Legales Vigentes (SMMLV). 
              El valor se solicita en pesos colombianos (COP).
            </p>
            <div className="input-group">
              <span className="input-group-text">COP</span>
              <input
                type="number"
                className={`form-control ${errors.garantiaMonto ? 'is-invalid' : ''}`}
                placeholder="Valor en pesos colombianos"
                {...register('garantiaMonto', {
                  required: 'Monto de garantía obligatorio',
                  valueAsNumber: true,
                  validate: (value) => {
                    return value >= garantiaMinima
                      ? true
                      : `El monto debe ser mínimo ${garantiaMinima.toLocaleString()} COP`;
                  }
                })}
              />
              <div className="invalid-feedback">{errors.garantiaMonto?.message}</div>
            </div>
            <small className="form-text text-muted">Ejemplo cálculo: {GARANTIA_FACTOR} * SMMLV ({SMMLV_DEFAULT.toLocaleString()}) = <strong>{(GARANTIA_FACTOR * SMMLV_DEFAULT).toLocaleString()}</strong> COP</small>
          </div>

          <div className="col-md-12">
            <label className="form-label">Tipo de Instrumento *</label>
            <select className={`form-select ${errors.instrumentoTipo ? 'is-invalid' : ''}`} {...register('instrumentoTipo', { required: 'Seleccione el tipo de instrumento' })}>
              <option value="">-- Seleccione una opción --</option>
              <option value="cheque">Cheque de Gerencia</option>
              <option value="garantia_bancaria">Garantía Bancaria Irrevocable</option>
            </select>
            <div className="invalid-feedback">{errors.instrumentoTipo?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Entidad Emisora del Instrumento *</label>
            <input
              className={`form-control ${errors.entidadEmisora ? 'is-invalid' : ''}`}
              {...register('entidadEmisora', {
                required: 'Entidad emisora obligatoria',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/,
                  message: 'Solo se permiten letras, números, espacios y el símbolo &'
                },
                validate: (v) =>
                  /[<>]/.test(v) ? 'Contiene caracteres inválidos' : true,
              })}
            />
            <div className="invalid-feedback">{errors.entidadEmisora?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Número del Instrumento (Garantía Bancaria Irrevocable / Cheque de Gerencia) *</label>
            <input
              className={`form-control ${errors.instrumentoNumero ? 'is-invalid' : ''}`}
              {...register('instrumentoNumero', {
                required: 'Número del instrumento obligatorio',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                maxLength: { value: 15, message: 'Máximo 15 caracteres' },
                pattern: { value: /^[A-Za-z0-9-]+$/, message: 'Sólo caracteres alfanuméricos y guiones' },
              })}
            />
            <div className="invalid-feedback">{errors.instrumentoNumero?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label me-2">Fecha de Expedición del Instrumento * </label>
            <Controller
              control={control}
              name="fechaExpedicion"
              rules={{
                required: 'Fecha de expedición obligatoria',
                validate: (v) => {
                  if (!v) return 'Fecha obligatoria';

                  const fecha = new Date(v);
                  fecha.setHours(0, 0, 0, 0);

                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);

                  if (fecha.getTime() === hoy.getTime())
                    return 'La fecha de expedición no puede ser la fecha actual';

                  if (fecha > hoy)
                    return 'La fecha de expedición no puede ser futura';

                  return true;
                },
              }}
              render={({ field }) => (
                <DatePicker
                  className={`form-control ${errors.fechaExpedicion ? 'is-invalid' : ''}`}
                  placeholderText="dd/MM/yyyy"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(d) => field.onChange(d ? d.toISOString().split("T")[0] : "")}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
            <div className="invalid-feedback">{errors.fechaExpedicion?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label me-2">Vigencia del Instrumento * </label>
            <Controller
              control={control}
              name="vigenciaInstrumento"
              rules={{
                required: 'Vigencia obligatoria',
                validate: (v) => {
                  if (!v) return 'Vigencia obligatoria';

                  const vig = new Date(v);
                  vig.setHours(0, 0, 0, 0);

                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);

                  const exp = watchFechaExp;

                  // 1) No puede ser futura
                  if (vig.getTime() > hoy.getTime()) return 'La vigencia no puede ser una fecha futura';

                  // 2) Debe ser igual o posterior a la expedición
                  if (exp && v < exp)
                    return 'La vigencia debe ser igual o posterior a la fecha de expedición';

                  return true;
                },
              }}
              render={({ field }) => (
                <DatePicker
                  className={`form-control ${errors.vigenciaInstrumento ? 'is-invalid' : ''}`}
                  placeholderText="dd/MM/yyyy"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(d) => field.onChange(d ? d.toISOString().split("T")[0] : "")}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
            <div className="invalid-feedback">{errors.vigenciaInstrumento?.message}</div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <button className="btn buttonsBack" onClick={back}>
          <FaLongArrowAltLeft /> Atrás
        </button>

        <button className="btn buttons" onClick={handleSubmit(onValid)}>
          Siguiente <FaLongArrowAltRight />
        </button>
      </div>
    </>
  );
}