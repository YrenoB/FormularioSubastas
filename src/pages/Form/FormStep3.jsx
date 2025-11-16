import Swal from "sweetalert2";
import { FaTrash, FaPlus } from "react-icons/fa";
import { FaLongArrowAltLeft, FaLongArrowAltRight  } from 'react-icons/fa';

export default function FormStep3({ register, errors, fields, append, remove, handleSubmit, next, back }) {

  const handleRemoveProject = (index, remove) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este proyecto será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel"
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        remove(index);

        Swal.fire({
          title: "Proyecto eliminado",
          text: "El proyecto ha sido eliminado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn-confirm"
          },
          buttonsStyling: false
        });
      }
    });
  };
  
  const onValid = () => next();

  return (
    <>
      <h4>III. JUSTIFICACIÓN Y DESCRIPCIÓN DE PROYECTOS</h4>

      <p className="text-muted small">Agrega al menos un proyecto. 
        El proponente declara que los certificados que busca adquirir en la subasta están 
        directamente relacionados con la ejecución y desarrollo de proyectos inmobiliarios 
        ubicados en Zonas Receptoras de la ciudad de Bogotá D.C.
      </p>

        {fields.map((item, index) => (
          <div key={item.id} className="card borderGreen rounded-4 mb-2 project-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Proyecto #{index + 1}</strong>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveProject(index, remove)} disabled={fields.length === 1}><FaTrash /> Eliminar</button>
              </div>

              <div className="row gx-2 gy-2">
                <div className="col-md-2">
                  <label className="form-label">Número</label>
                  <input className="form-control text-center" value={index + 1} readOnly disabled/>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Nombre del Proyecto *</label>
                    <input
                      className={`form-control ${errors.proyectos?.[index]?.nombre ? 'is-invalid' : ''}`}
                      {...register(`proyectos.${index}.nombre`, {
                        required: 'Nombre obligatorio',
                        minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                        validate: (v) => {
                          if (/[<>]/.test(v)) return 'Contiene caracteres inválidos';
                          if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/.test(v))
                            return 'Sólo se permiten letras, números, espacios, puntos guiones y &';
                          return true;
                        }
                      })}
                    />
                  <div className="invalid-feedback">{errors.proyectos?.[index]?.nombre?.message}</div>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Ubicación (Dirección e identificación de la Zona Receptora) *</label>
                  <input
                    className={`form-control ${errors.proyectos?.[index]?.ubicacion ? 'is-invalid' : ''}`}
                    {...register(`proyectos.${index}.ubicacion`, { 
                      required: 'Ubicación obligatoria', 
                      minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                    })}
                  />
                  <div className="invalid-feedback">{errors.proyectos?.[index]?.ubicacion?.message}</div>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Tamaño (Metros cuadrados de construcción total) *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.proyectos?.[index]?.tamano ? 'is-invalid' : ''}`}
                    {...register(`proyectos.${index}.tamano`, { required: 'Tamaño obligatorio', valueAsNumber: true, min: { value: 1, message: 'Debe ser mayor que cero' } })}
                  />
                  <div className="invalid-feedback">{errors.proyectos?.[index]?.tamano?.message}</div>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Estado Actual del Proyecto*</label>
                  <select
                    className={`form-select ${errors.proyectos?.[index]?.estado ? 'is-invalid' : ''}`}
                    {...register(`proyectos.${index}.estado`, { required: 'Estado obligatorio' })}
                  >
                    <option value="">-- Seleccione una opción --</option>
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
          <button type="button" className="btn btnAgregar" onClick={() => append({ numero: fields.length + 1, nombre: '', ubicacion: '', tamano: '', estado: '' })}><FaPlus /> Agregar Proyecto</button>
          <div className="text-danger small mt-1">{errors.proyectos?.message}</div>
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