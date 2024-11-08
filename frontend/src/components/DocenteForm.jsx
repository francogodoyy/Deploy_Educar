import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, IconButton, CardMedia } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';

// Componente principal que muestra un formulario para registrar un docente
const DocenteForm = ({ talleres }) => {
  // Estado para manejar el índice del taller actualmente mostrado
  const [index, setIndex] = useState(0);

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombreApellido: '',
    escuela: '',
    dni: '',
    email: '',
    telefono: '',
    estado: 'ACTIVADO',
  });

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
    try {
      // Enviar los datos del formulario junto con la información del taller actual al backend
      await axios.post("http://localhost:3000/post/docente", {
        ...formData,
        tallerTitulo: talleres[index].titulo,
        tallerFecha: formatDate(talleres[index].fecha),
      });
      alert('El turno se agregó'); // Muestra un mensaje de éxito

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

  // Obtiene el taller actual a partir del índice
  const tallerActual = talleres[index];

  return (
    // Formulario principal
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
