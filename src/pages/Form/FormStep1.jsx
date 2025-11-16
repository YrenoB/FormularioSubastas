//import Swal from 'sweetalert2';
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEnvelope, FaPhoneAlt, FaLongArrowAltRight } from 'react-icons/fa';
import Logos from '../../assets/logosEmpresas.png';


export default function FormStep1({ register, errors, handleSubmit, next }) {

  const telefonoPattern = /^(3\d{9}|601\d{7}|6\d{7}|0\d{2}\d{7}|018000\d{6})$/;
  const onValid = () => next();

  return (
    <>
      <br />
      <h2 className="card-title text-center">FORMATO DE INSCRIPCIÓN Y ACEPTACIÓN DE TÉRMINOS Y CONDICIONES</h2>
      <br />
      <h6 className="text-center text-muted mb-3">PROCESO DE SUBASTA DE CERTIFICADOS DE CONSTRUCCIÓN Y DESARROLLO EMITIDOS BAJO LA MODALIDAD ANTICIPADA</h6>

      <div className="borderGreen rounded-4 mb-3 p-4">
        <div className="mb-3">
          <strong>Convoca:</strong>
          <div className="p-2 mt-1 titulos">[Nombre de la Empresa o la Sociedad Fiduciaria designada para tal efecto]</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label"><strong>Fecha de Convocatoria:</strong></label>
            <div className="p-2 titulos">[Fecha de publicación de la Convocatoria Oficial]</div>
          </div>
          <div className="col-md-6">
            <label className="form-label"><strong>Plazo Límite de Presentación:</strong></label>
            <div className="p-2 titulos">[Fecha y Hora Límite]</div>
          </div>
        </div>
        <img src={Logos} className="img-fluid img-logos" alt="logosEmpresas" />
        <br /><br />
      </div>
      <br />
      <h4>I. INFORMACIÓN LEGAL Y DE CONTACTO DEL PROPONENTE</h4>

      <div className="row gx-3 gy-2">
        <div className="col-md-12">
          <label className="form-label">Correo Electrónico *</label>
          <div className="input-group">
            <span className="input-group-text"><FaEnvelope /></span>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de correo inválido' },
              })}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
        </div>

        <div className="col-md-12 col-lg-6">
          <label className="form-label">Nombre o Razón Social *</label>
          <input
            type="text"
            className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
            {...register('razonSocial', {
              required: 'Nombre o razón social obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/,
                message: 'Sólo se permiten letras, números, espacios, puntos guiones y &',
              },
              validate: (v) =>
                /[<>]/.test(v) ? 'Contiene caracteres inválidos' : true,
            })}
          />
          <div className="invalid-feedback">{errors.razonSocial?.message}</div>
        </div>

        <div className="col-md-12 col-lg-6">
          <label className="form-label">Cédula o NIT *</label>
          <input
            type="text"
            className={`form-control ${errors.nit ? 'is-invalid' : ''}`}
            {...register('nit', {
              required: 'Cédula o NIT obligatorio',
              validate: {
                noCeroInicial: (value) =>
                  !value.startsWith('0') || 'No puede iniciar en 0',
              },
              pattern: {
                value: /^\d{6,12}$/,
                message: 'Solo números',              
              },
              minLength: {
                value: 6,
                message: 'Debe tener mínimo 6 dígitos',
              },
              maxLength: {
                value: 12,
                message: 'Debe tener máximo 12 dígitos',
              },
            })}
          />
          <div className="invalid-feedback">{errors.nit?.message}</div>
        </div>

        <div className="col-md-12"> 
          <label className="form-label">Domicilio Principal *</label>
          <input
            className={`form-control ${errors.domicilio ? 'is-invalid' : ''}`}
            placeholder="Ciudad/País. Ej.: Bogotá/Colombia"
            {...register('domicilio', {
              required: 'Domicilio obligatorio',
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+\/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+$/,
                message: 'Formato inválido. Usa Ciudad/País',
              },
              validate: (v) =>
                v.split('/').length === 2 &&
                v.split('/')[0].trim().length > 1 &&
                v.split('/')[1].trim().length > 1
                  ? true
                  : 'Debe contener Ciudad y País válidos',
            })}
          />
          <div className="invalid-feedback">{errors.domicilio?.message}</div>
        </div>

        <div className="col-md-12 col-lg-6">
          <label className="form-label">Nombre del Representante Legal *</label>
          <input
            className={`form-control ${errors.representante ? 'is-invalid' : ''}`}
            {...register('representante', {
              required: 'Nombre del representante obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              pattern: { value: /^[A-Za-zÀ-ÿ\s]+$/, message: 'Sólo letras y espacios' },
            })}
          />
          <div className="invalid-feedback">{errors.representante?.message}</div>
        </div>

        <div className="col-md-12 col-lg-6">
          <label className="form-label">Cédula del Representante *</label>
          <input
            className={`form-control ${errors.cedulaRep ? 'is-invalid' : ''}`}
            {...register('cedulaRep', {
              required: 'Cédula del representante obligatoria',
              valueAsNumber: true,
              pattern: { value: /^[0-9]+$/, message: 'Sólo números' },
              minLength: { value: 6, message: 'Mínimo 6 dígitos' },
              maxLength: { value: 10, message: 'Máximo 10 dígitos' },
            })}
          />
          <div className="invalid-feedback">{errors.cedulaRep?.message}</div>
        </div>

        <div className="col-md-12 col-lg-6">
          <label className="form-label">Dirección Notificación Física (Opcional)</label>
          <input
            className={`form-control ${errors.direccionNotificacion ? 'is-invalid' : ''}`}
            {...register('direccionNotificacion', {
              minLength: { value: 10, message: 'Mínimo 10 caracteres' },
            })}
          />
          <div className="invalid-feedback">{errors.direccionNotificacion?.message}</div>
        </div>

        <div className="col-md-12 col-lg-6">
          <label className="form-label">Teléfono de Contacto *</label>
          <div className="input-group">
            <span className="input-group-text"><FaPhoneAlt /></span>
            <input
              type="text"
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              {...register('telefono', {
                required: 'Teléfono obligatorio',
                valueAsNumber: true,
                pattern: { value: telefonoPattern, message: 'Formato teléfono inválido sin espacios, sólo números. (ej: celular inicia con 3 o fijo inicia por 6 o 0)' },
              })}
            />
            <div className="invalid-feedback">{errors.telefono?.message}
            </div>
          </div>
        </div>

      </div>

      <div className="text-end mt-5">
        <button type="button" className="btn buttons" onClick={handleSubmit(onValid)}>
          Siguiente <FaLongArrowAltRight />
        </button>
      </div>
    </>
  );
}