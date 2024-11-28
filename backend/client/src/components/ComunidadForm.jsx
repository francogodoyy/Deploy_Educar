import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Typography, CardMedia, IconButton,FormControlLabel,Checkbox } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';

// Componente principal del formulario de comunidad
const ComunidadForm = ({ talleres }) => {
  // Estado para el índice del taller actual en la lista
  const [index, setIndex] = useState(0);
  const [descargaWord, setDescargaWord] = useState(false)
  const [cuposDisponibles, setCuposDisponibles ]= useState(null)
  // Obtener el taller actual en base al índice
  const tallerActual = talleres[index];


  const fetchCuposDisponibles = async (tallerId) => {
    try {
      const response = await axios.get(`http://localhost:3000/capacidad-taller-comunidad/${tallerId}`);
      setCuposDisponibles(response.data.turnosDisponibles);
    } catch (error) {
      console.error('Error fetching turnos disponibles:', error);
      setCuposDisponibles(null);
    }
  };

  // Update useEffect to fetch capacity when taller changes
  useEffect(() => {
    if (tallerActual && tallerActual.id) {
      fetchCuposDisponibles(tallerActual.id);
    }
  }, [tallerActual]); // This will run whenever tallerActual changes
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombreApellido: '',
    edad: '',
    fechaNacimiento: '',
    nombreApellidoTutor: '',
    telefono: '',
    email: '',
    estado: 'ACTIVADO',
  });


  const handleDescarga = ()=>{
    const link = document.createElement("a");
    link.href = "/public/AUTORIZACION DE USO Y CESIÓN DE IMAGEN Y VOZ DE MENORES- ConectarLAB Chaco.docx";
    link.download = 'AUTORIZACION DE USO Y CESIÓN DE IMAGEN Y VOZ DE MENORES';
    link.click();
    setDescargaWord(true)
  }

  // Maneja los cambios en los campos de texto del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para formatear la fecha al formato ISO (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Maneja el envío del formulario, enviando los datos al servidor
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento de recarga por defecto del formulario
    if(!descargaWord){
      alert('Por favor, descargue el formulario de autorizacion de imagen a traves del boton: "Descargar Formulario"')
      return;
    }

    try {
      const capacidadResponse = await axios.get(`http://localhost:3000/capacidad-taller-comunidad/${tallerActual.id}`);

      if (capacidadResponse.data.turnosDisponibles > 0) {
        console.log(`los turnos disponibles del taller ${tallerActual.titulo} con id:  ${tallerActual.id} es de ${capacidadResponse.data.turnosDisponibles}`)
        // Proceed with inscription
        await axios.post("http://localhost:3000/post/comunidad", {
          ...formData, 
          tallerTitulo: tallerActual.titulo, // Incluye título y fecha del taller actual
          tallerFecha: formatDate(tallerActual.fecha),
          tallerId: tallerActual.id,
        });
        // Show success message
      } else {
        alert('Lo sentimos, este taller está lleno');
        return;
      }
      alert('El turno se agregó'); // Mensaje de éxito
      console.log(`los turnos disponibles del taller ${tallerActual.titulo} con id:  ${tallerActual.id} es de ${capacidadResponse.data.turnosDisponibles}`)
      fetchCuposDisponibles(tallerActual.id)
      setFormData({
        nombreApellido: '',
        edad: '',
        fechaNacimiento: '',
        nombreApellidoTutor: '',
        telefono: '',
        email: '',
        estado: 'ACTIVADO',
      }); // Resetea el formulario
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      alert('Error al cargar'); // Mensaje de error
    }
  };

  // Cambia al taller anterior en la lista
  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : talleres.length - 1));
  };

  // Cambia al siguiente taller en la lista
  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex < talleres.length - 1 ? prevIndex + 1 : 0));
  };



  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {/* Encabezado y contenido del taller actual */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{
            fontWeight: 600,
            paddingBottom: '8px',
            marginBottom: '16px',
            textTransform: 'capitalize',
            letterSpacing: '0.5px',
            fontSize: '1.5rem',
          }}
        >
          {tallerActual.titulo} {/* Muestra el título del taller actual */}
        </Typography>

        {/* Imagen del taller si está disponible */}
        {tallerActual.imagen && (
          <CardMedia
            component="img"
            alt={tallerActual.titulo}
            image={tallerActual.imagen}
            title={tallerActual.titulo}
            sx={{ 
              display: 'block', 
              margin: '0 auto', 
              maxWidth: '35%', 
              height: 'auto', 
              marginBottom: 2  
            }}
          />
        )}
        {/* Add Turnos Disponibles display */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 2,
            color: cuposDisponibles === 0 ? 'error.main' : 'success.main',
            fontWeight: 'medium',
          }}
        >
          {cuposDisponibles !== null ? (
            cuposDisponibles > 0 ? 
              `Cupos Disponibles: ${cuposDisponibles}` : 
              'Taller completo'
          ) : (
            'Cargando disponibilidad...'
          )}
        </Typography>

        {/* Fecha del taller en un campo de solo lectura */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={formatDate(tallerActual.fecha)}  
              disabled
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Campos del formulario para ingresar los datos */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Apellido y Nombre (del niño)"
            name="nombreApellido"
            value={formData.nombreApellido}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Edad (del niño)"
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento (del niño)"
            name="fechaNacimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre y Apellido del Tutor"
            name="nombreApellidoTutor"
            value={formData.nombreApellidoTutor}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Teléfono del Tutor"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Correo Electrónico del Tutor"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>
      <Grid item xs={12} alignItems="center" sx={{mt:3}}>
              <FormControlLabel 
                control={<Checkbox required />} 
                label="Acepto los términos y condiciones de uso" 
              />
              <Button 
              variant='contained'
              required
              style={{backgroundColor: '#8D5CF6'}}
              onClick={()=>{
                window.open('/public/PAUTAS GENERALES para USO de INSTALACIONES Y RECURSOS ConectarLAB Chaco (MODIF.).docx.pdf', '_blank');
              }}
              >
              Ver Condiciones 
              </Button>
            </Grid>
            <Grid container alignItems="center" sx={{mt:1}}>
            <Typography style={{marginLeft:25}}>
            Formulario de autorización de Imagen
            </Typography>
            <Button
              onClick={handleDescarga}
              variant="contained"
              style={{ backgroundColor: '#8D5CF6', marginLeft:25 }}
            >
              Descargar Formulario <DownloadIcon />
          </Button>
            </Grid>
      
      {/* Botones de navegación y envío del formulario */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, gap: 2 }}>
        {talleres.length > 1 && (
          <IconButton onClick={handlePrevious} color="primary">
            <ArrowBackIosIcon /> {/* Botón para ir al taller anterior */}
          </IconButton>
        )}

        {/* Botón para cancelar y resetear el formulario */}
        <Button 
          variant="contained" 
          style={{backgroundColor: '#E7214E'}} 
          onClick={() => {
            setFormData({
              nombreApellido: '',
              edad: '',
              fechaNacimiento: '',
              nombreApellidoTutor: '',
              telefono: '',
              email: '',
              estado: 'ACTIVADO',
            });
          }}
        >
          Cancelar
        </Button>

        {/* Botón para enviar el formulario */}
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          sx={{ minWidth: '120px' }}
          style={{backgroundColor: '#8D5CF6'}}
        >
          Enviar
        </Button>

        {talleres.length > 1 && (
          <IconButton onClick={handleNext} color="primary">
            <ArrowForwardIosIcon /> {/* Botón para ir al siguiente taller */}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ComunidadForm;
