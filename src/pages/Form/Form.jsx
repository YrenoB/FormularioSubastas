import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEnvelope, FaUser, FaPhone, FaFileContract, FaPlus, FaTrash } from 'react-icons/fa';


export default function Form() {
  // --- constantes / configuración ---
  const SMMLV_DEFAULT = 1423500; // ejemplo; cámbialo según corresponda
  const GARANTIA_FACTOR = 150;
  const garantiaMinima = SMMLV_DEFAULT * GARANTIA_FACTOR;

  // --- react-hook-form ---
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
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
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'proyectos' });

  const watchFechaExp = watch('fechaExpedicion');
  //const watchVigencia = watch('vigenciaInstrumento');
 // const watchProyectos = watch('proyectos');

  // --- helpers / validaciones complejas ---
  const telefonoPattern = /^(3\d{9}|6\d{8})$/; 
  // celular móvil colombiano: inicia con 3 y total 10 dígitos (3 + 9) -> pattern 3 + 9 digits => 10 digits;  
  // fijo con "6" + indicativo (1 dígito?) + 7 dígitos — se simplifica a 6 + 8 dígitos for this pattern.

  function validateDates(values) {
    const today = new Date();
    const exp = values.fechaExpedicion;
    const vig = values.vigenciaInstrumento;

    if (!exp) {
      setError('fechaExpedicion', { type: 'required', message: 'Fecha de expedición obligatoria' });
      return false;
    }
    // no puede ser futura
    if (exp > today) {
      setError('fechaExpedicion', { type: 'validate', message: 'La fecha de expedición no puede ser futura' });
      return false;
    }
    if (!vig) {
      setError('vigenciaInstrumento', { type: 'required', message: 'Vigencia obligatoria' });
      return false;
    }
    // vigencia >= expedición
    if (vig < exp) {
      setError('vigenciaInstrumento', { type: 'validate', message: 'La vigencia debe ser igual o posterior a la fecha de expedición' });
      return false;
    }
    // vigencia no puede ser extremadamente corta (regla opcional)
    clearErrors(['fechaExpedicion', 'vigenciaInstrumento']);
    return true;
  }

  function validateProyectos(proyectos) {
    if (!proyectos || proyectos.length < 1) {
      setError('proyectos', { type: 'min', message: 'Agrega al menos un proyecto' });
      return false;
    }
    // Validar cada proyecto
    for (let i = 0; i < proyectos.length; i++) {
      const p = proyectos[i];
      if (!p.nombre || p.nombre.trim().length < 5) {
        setError(`proyectos.${i}.nombre`, { type: 'minLength', message: 'Nombre mínimo 5 caracteres' });
        return false;
      }
      if (!p.ubicacion || p.ubicacion.trim().length < 5) {
        setError(`proyectos.${i}.ubicacion`, { type: 'required', message: 'Ubicación obligatoria' });
        return false;
      }
      if (!p.tamano || Number(p.tamano) <= 0) {
        setError(`proyectos.${i}.tamano`, { type: 'min', message: 'Tamaño debe ser mayor que cero' });
        return false;
      }
      if (!p.estado) {
        setError(`proyectos.${i}.estado`, { type: 'required', message: 'Estado obligatorio' });
        return false;
      }
    }
    clearErrors('proyectos');
    return true;
  }

  // --- submit ---
  const onSubmit = (data) => {
    // validaciones compuestas
    clearErrors();
    // 1) garantía mínima
    const monto = Number(data.garantiaMonto || 0);
    if (isNaN(monto) || monto <= 0) {
      setError('garantiaMonto', { type: 'required', message: 'Monto de la garantía obligatorio' });
      return;
    }
    if (monto < garantiaMinima) {
      setError('garantiaMonto', { type: 'min', message: `El monto mínimo es ${garantiaMinima.toLocaleString('es-CO')}` });
      return;
    }
    // 2) fechas
    if (!validateDates(data)) return;
    // 3) proyectos
    if (!validateProyectos(data.proyectos)) return;

    // Confirmación antes de enviar
    Swal.fire({
      title: 'Confirmar envío',
      html: '<strong>¿Desea enviar el formulario de inscripción?</strong>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
    }).then((res) => {
      if (res.isConfirmed) {
        // Aquí llamarías a tu API. Por ahora mostramos success con resumen.
        Swal.fire({
          icon: 'success',
          title: 'Inscripción enviada',
          html: `<pre style="text-align:left">${JSON.stringify(data, null, 2)}</pre>`,
          width: 800,
        });
      }
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="card cardPpal">
        <div className="card-body cardBodyPpal">
          <h2 className="card-title text-center">FORMATO DE INSCRIPCIÓN Y ACEPTACIÓN DE TÉRMINOS Y CONDICIONES</h2>
          <h6 className="text-center text-muted mb-3">PROCESO DE SUBASTA DE CERTIFICADOS DE CONSTRUCCIÓN Y DESARROLLO EMITIDOS BAJO LA MODALIDAD ANTICIPADA</h6>

          <div className="mb-3">
            <strong>Convoca:</strong>
            <div className="border p-2 mt-1">[Nombre de la Empresa o la Sociedad Fiduciaria designada para tal efecto]</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Fecha de Convocatoria:</label>
              <div className="border p-2">[Fecha de publicación de la Convocatoria Oficial]</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Plazo Límite de Presentación:</label>
              <div className="border p-2">[Fecha y Hora Límite]</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h5 className="mt-3">I. INFORMACIÓN LEGAL Y DE CONTACTO DEL PROPONENTE</h5>

            <div className="row gx-3 gy-2">
              <div className="col-md-6">
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

              <div className="col-md-6">
                <label className="form-label">Nombre o Razón Social *</label>
                <div className="input-group">
                  <span className="input-group-text"><FaUser /></span>
                  <input
                    type="text"
                    className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
                    {...register('razonSocial', {
                      required: 'Nombre o razón social obligatorio',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                      validate: (v) => (/[<>]/.test(v) ? 'Contiene caracteres inválidos' : true),
                    })}
                  />
                  <div className="invalid-feedback">{errors.razonSocial?.message}</div>
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Cédula o NIT *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nit ? 'is-invalid' : ''}`}
                  {...register('nit', { required: 'Cédula o NIT obligatorio', pattern: { value: /^[0-9]+$/, message: 'Sólo números' } })}
                />
                <div className="invalid-feedback">{errors.nit?.message}</div>
              </div>

              <div className="col-md-8">
                <label className="form-label">Domicilio Principal *</label>
                <input
                  className={`form-control ${errors.domicilio ? 'is-invalid' : ''}`}
                  placeholder="Ciudad/País. Ej.: Bogotá/Colombia"
                  {...register('domicilio', { required: 'Domicilio obligatorio' })}
                />
                <div className="invalid-feedback">{errors.domicilio?.message}</div>
              </div>

              <div className="col-md-6">
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

              <div className="col-md-6">
                <label className="form-label">Cédula del Representante *</label>
                <input
                  className={`form-control ${errors.cedulaRep ? 'is-invalid' : ''}`}
                  {...register('cedulaRep', {
                    required: 'Cédula del representante obligatoria',
                    pattern: { value: /^[0-9]+$/, message: 'Sólo números' },
                    minLength: { value: 6, message: 'Mínimo 6 dígitos' },
                    maxLength: { value: 10, message: 'Máximo 10 dígitos' },
                  })}
                />
                <div className="invalid-feedback">{errors.cedulaRep?.message}</div>
              </div>

              <div className="col-12">
                <label className="form-label">Dirección Notificación Física (Opcional)</label>
                <input
                  className={`form-control ${errors.direccionNotificacion ? 'is-invalid' : ''}`}
                  {...register('direccionNotificacion', {
                    minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                  })}
                />
                <div className="invalid-feedback">{errors.direccionNotificacion?.message}</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Teléfono de Contacto *</label>
                <div className="input-group">
                  <span className="input-group-text"><FaPhone /></span>
                  <input
                    type="text"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    {...register('telefono', {
                      required: 'Teléfono obligatorio',
                      pattern: { value: telefonoPattern, message: 'Formato teléfono inválido (ej: celular inicia con 3)' },
                    })}
                  />
                  <div className="invalid-feedback">{errors.telefono?.message}</div>
                </div>
              </div>
            </div>

            <hr className="my-3" />

            <h5>II. REQUISITOS FINANCIEROS Y DOCUMENTACIÓN LEGAL</h5>
            <p className="text-muted small">A. Documentación obligatoria (se solicita adjuntar en anexos): certificados, estados, autorizaciones y soportes SARLAFT.</p>

            <div className="row gx-3 gy-2">
              <div className="col-md-6">
                <label className="form-label">Monto de la Garantía (COP) *</label>
                <div className="input-group">
                  <span className="input-group-text">COP</span>
                  <input
                    type="number"
                    className={`form-control ${errors.garantiaMonto ? 'is-invalid' : ''}`}
                    {...register('garantiaMonto', {
                      required: 'Monto de garantía obligatorio',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Debe ser mayor que cero' },
                    })}
                  />
                  <div className="invalid-feedback">{errors.garantiaMonto?.message}</div>
                </div>
                <small className="form-text text-muted">Ejemplo cálculo: {GARANTIA_FACTOR} * SMMLV ({SMMLV_DEFAULT.toLocaleString()}) = <strong>{(GARANTIA_FACTOR * SMMLV_DEFAULT).toLocaleString()}</strong> COP</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Tipo de Instrumento *</label>
                <select className={`form-select ${errors.instrumentoTipo ? 'is-invalid' : ''}`} {...register('instrumentoTipo', { required: 'Seleccione el tipo de instrumento' })}>
                  <option value="">-- Seleccione --</option>
                  <option value="cheque">Cheque de Gerencia</option>
                  <option value="garantia_bancaria">Garantía Bancaria Irrevocable</option>
                </select>
                <div className="invalid-feedback">{errors.instrumentoTipo?.message}</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Entidad Emisora del Instrumento *</label>
                <input
                  className={`form-control ${errors.entidadEmisora ? 'is-invalid' : ''}`}
                  {...register('entidadEmisora', {
                    required: 'Entidad emisora obligatoria',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                    validate: (v) => (/[<>]/.test(v) ? 'Contiene caracteres inválidos' : true),
                  })}
                />
                <div className="invalid-feedback">{errors.entidadEmisora?.message}</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Número del Instrumento (8-15 caracteres) *</label>
                <input
                  className={`form-control ${errors.instrumentoNumero ? 'is-invalid' : ''}`}
                  {...register('instrumentoNumero', {
                    required: 'Número del instrumento obligatorio',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    maxLength: { value: 15, message: 'Máximo 15 caracteres' },
                    pattern: { value: /^[A-Za-z0-9\-]+$/, message: 'Sólo caracteres alfanuméricos y guiones' },
                  })}
                />
                <div className="invalid-feedback">{errors.instrumentoNumero?.message}</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de Expedición *</label>
                <Controller
                  control={control}
                  name="fechaExpedicion"
                  rules={{
                    required: 'Fecha de expedición obligatoria',
                    validate: (v) => {
                      if (!v) return 'Fecha obligatoria';
                      const today = new Date();
                      if (v > today) return 'La fecha de expedición no puede ser futura';
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      className={`form-control ${errors.fechaExpedicion ? 'is-invalid' : ''}`}
                      placeholderText="dd/MM/yyyy"
                      selected={field.value}
                      onChange={(d) => field.onChange(d)}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
                <div className="invalid-feedback">{errors.fechaExpedicion?.message}</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Vigencia del Instrumento *</label>
                <Controller
                  control={control}
                  name="vigenciaInstrumento"
                  rules={{
                    required: 'Vigencia obligatoria',
                    validate: (v) => {
                      if (!v) return 'Vigencia obligatoria';
                      const exp = watchFechaExp;
                      if (exp && v < exp) return 'La vigencia debe ser igual o posterior a la fecha de expedición';
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      className={`form-control ${errors.vigenciaInstrumento ? 'is-invalid' : ''}`}
                      placeholderText="dd/MM/yyyy"
                      selected={field.value}
                      onChange={(d) => field.onChange(d)}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
                <div className="invalid-feedback">{errors.vigenciaInstrumento?.message}</div>
              </div>
            </div>

            <hr className="my-3" />

            <h5>III. JUSTIFICACIÓN Y DESCRIPCIÓN DE PROYECTOS</h5>
            <p className="text-muted small">Agrega al menos un proyecto. El proponente declara que los certificados están relacionados con proyectos en Zonas Receptoras de Bogotá D.C.</p>

            {fields.map((item, index) => (
              <div key={item.id} className="card mb-2 project-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Proyecto #{index + 1}</strong>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(index)} disabled={fields.length === 1}><FaTrash /> Eliminar</button>
                  </div>

                  <div className="row gx-2 gy-2">
                    <div className="col-md-2">
                      <label className="form-label">Número</label>
                      <input className="form-control" value={index + 1} readOnly />
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Nombre del Proyecto *</label>
                      <input
                        className={`form-control ${errors.proyectos?.[index]?.nombre ? 'is-invalid' : ''}`}
                        {...register(`proyectos.${index}.nombre`, { required: 'Nombre obligatorio', minLength: { value: 5, message: 'Mínimo 5 caracteres' } })}
                      />
                      <div className="invalid-feedback">{errors.proyectos?.[index]?.nombre?.message}</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Ubicación *</label>
                      <input
                        className={`form-control ${errors.proyectos?.[index]?.ubicacion ? 'is-invalid' : ''}`}
                        {...register(`proyectos.${index}.ubicacion`, { required: 'Ubicación obligatoria' })}
                      />
                      <div className="invalid-feedback">{errors.proyectos?.[index]?.ubicacion?.message}</div>
                    </div>

                    <div className="col-md-1">
                      <label className="form-label">Tamaño (m²) *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.proyectos?.[index]?.tamano ? 'is-invalid' : ''}`}
                        {...register(`proyectos.${index}.tamano`, { required: 'Tamaño obligatorio', valueAsNumber: true, min: { value: 1, message: 'Debe ser mayor que cero' } })}
                      />
                      <div className="invalid-feedback">{errors.proyectos?.[index]?.tamano?.message}</div>
                    </div>

                    <div className="col-md-1">
                      <label className="form-label">Estado *</label>
                      <select
                        className={`form-select ${errors.proyectos?.[index]?.estado ? 'is-invalid' : ''}`}
                        {...register(`proyectos.${index}.estado`, { required: 'Estado obligatorio' })}
                      >
                        <option value="">--</option>
                        <option value="predios">Predios adquiridos</option>
                        <option value="titulos">Estudio de títulos</option>
                        <option value="diseno">Diseño arquitectónico finalizado</option>
                        <option value="licencia">Trámite de licencia</option>
                      </select>
                      <div className="invalid-feedback">{errors.proyectos?.[index]?.estado?.message}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mb-3">
              <button type="button" className="btn btn-sm btn-outline-success" onClick={() => append({ numero: fields.length + 1, nombre: '', ubicacion: '', tamano: '', estado: '' })}><FaPlus /> Agregar Proyecto</button>
              <div className="text-danger small mt-1">{errors.proyectos?.message}</div>
            </div>

            <hr className="my-3" />

            <h5>IV. DECLARACIONES Y ACEPTACIÓN</h5>

            <div className="form-check mb-3">
              <input className={`form-check-input ${errors.acepta ? 'is-invalid' : ''}`} type="checkbox" id="acepta" {...register('acepta', { required: 'Debe aceptar los términos y condiciones' })} />
              <label className="form-check-label" htmlFor="acepta">
                Declaro bajo la gravedad de juramento que los datos son veraces y que acepto los términos y condiciones de la subasta.
              </label>
              <div className="invalid-feedback">{errors.acepta?.message}</div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <button type="submit" className="btn btn-primary me-2">Enviar Inscripción</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => {
                  // reinicia algunos valores visibles (no hace reset total)
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  Swal.fire({ icon: 'info', title: 'Formulario listo', timer: 900, showConfirmButton: false });
                }}>Volver arriba</button>
              </div>

              <div className="text-muted small">Firma del Representante Legal: ____________________ &nbsp; Fecha: {new Date().toLocaleDateString()}</div>
            </div>
          </form>

          <hr />

          <h6 className="text-muted">V. ANEXOS</h6>
          <p className="small">Adjunte los documentos que respalden la información diligenciada en los numerales I, II y III.</p>
        </div>
      </div>
    </div>
  );
}