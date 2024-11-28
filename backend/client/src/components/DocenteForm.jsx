import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Typography, IconButton, CardMedia,FormControlLabel,Checkbox } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';

// Componente principal que muestra un formulario para registrar un docente
const DocenteForm = ({ talleres }) => {
  // Estado para manejar el índice del taller actualmente mostrado
  const [index, setIndex] = useState(0);
  const [descargaWord, setDescargaWord] = useState(false)
  const [cuposDisponibles, setCuposDisponibles ]= useState(null)
  // Obtiene el taller actual a partir del índice
  const tallerActual = talleres[index];

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombreApellido: '',
    escuela: '',
    dni: '',
    email: '',
    telefono: '',
    estado: 'ACTIVADO',
  });
  

  const fetchCuposDisponibles = async (tallerId) => {
    try {
      const response = await axios.get(`http://localhost:3000/capacidad-taller-docente/${tallerId}`);
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

  const handleDescarga = ()=>{
    const link = document.createElement("a");
    link.href = "/public/AUTORIZACION DE USO Y CESIÓN DE IMAGEN Y VOZ DE MENORES- ConectarLAB Chaco.docx";
    link.download = 'AUTORIZACION DE USO Y CESIÓN DE IMAGEN Y VOZ DE MENORES';
    link.click();
    setDescargaWord(true)
  }

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para formatear una fecha en formato ISO (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el envío por defecto del formulario
    if(!descargaWord){
      alert('Por favor, descargue el formulario de autorizacion de imagen a traves del boton: "Descargar Formulario"')
      return;
    }
    try {

      const capacidadResponse = await axios.get(`http://localhost:3000/capacidad-taller-docente/${tallerActual.id}`);
      // Enviar los datos del formulario junto con la información del taller actual al backend
      if (capacidadResponse.data.turnosDisponibles > 0) {
        console.log(`los turnos disponibles del taller ${tallerActual.titulo} con id:  ${tallerActual.id} es de ${capacidadResponse.data.turnosDisponibles}`)
        // Proceed with inscription
        await axios.post("http://localhost:3000/post/docente", {
          ...formData, 
          tallerTitulo: tallerActual.titulo, // Incluye título y fecha del taller actual
          tallerFecha: formatDate(tallerActual.fecha),
          tallerId: tallerActual.id,
        });
      } else {
        alert('Lo sentimos, este taller está lleno');
        return;
      }
      alert('El turno se agregó'); // Muestra un mensaje de éxito 
      fetchCuposDisponibles(tallerActual.id)
      // Limpia los campos del formulario después del envío exitoso
      setFormData({
        nombreApellido: '',
        escuela: '',
        dni: '',
        email: '',
        telefono: '',
        estado: 'ACTIVADO',
      });
    } catch (error) {
      console.error('Error al enviar el formulario', error); // Muestra el error en consola
      alert('Error al cargar'); // Muestra un mensaje de error
    }
  };

  // Función para mostrar el taller anterior
  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : talleres.length - 1));
  };

  // Función para mostrar el siguiente taller
  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex < talleres.length - 1 ? prevIndex + 1 : 0));
  };



  return (
    // Formulario principal
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3}}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            paddingBottom: '8px',
            marginBottom: '16px',
            textTransform: 'capitalize',
            letterSpacing: '0.5px',
            fontSize: '1.5rem',
          }}
        >
          {tallerActual.titulo} {/* Título del taller actual */}
        </Typography>
        
        {tallerActual.imagen && ( // Imagen del taller si está disponible
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
          //display:'flex',
          //justifyContent:'center',
          //alignItems:'center',
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
      </Box>


      {/* Fecha del taller actual */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          value={formatDate(tallerActual.fecha)}
          disabled
          sx={{ mb: 2 }}
        />
      </Grid>
      
      {/* Campos del formulario */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre y Apellido"
            name="nombreApellido"
            value={formData.nombreApellido}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Escuela"
            name="escuela"
            value={formData.escuela}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="DNI"
            name="dni"
            type="number"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Número de Teléfono"
            name="telefono"
            type="tel"
            value={formData.telefono}
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

      {/* Botones para navegar entre talleres, cancelar y enviar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, gap: 2 }}>
        {talleres.length > 1 && (
          <IconButton onClick={handlePrevious} color="primary">
            <ArrowBackIosIcon />
          </IconButton>
        )}

        <Button variant="contained" style={{backgroundColor: '#E7214E'}} onClick={() => {
          // Restablece los datos del formulario al hacer clic en "Cancelar"
          setFormData({
            nombreApellido: '',
            escuela: '',
            dni: '',
            email: '',
            telefono: '',
            estado: 'ACTIVADO',
          });
        }}>
          Cancelar
        </Button>
        
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
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default DocenteForm;
