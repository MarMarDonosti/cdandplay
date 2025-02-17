// Verificar si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/perfil');
    if (response.ok) {
      const userData = await response.json();
      if (userData.username) {
        document.getElementById('noAuth').style.display = 'none';
        document.getElementById('auth').style.display = 'block';
        document.getElementById('username').textContent = userData.username;
      } else {
        document.getElementById('noAuth').style.display = 'block';
        document.getElementById('auth').style.display = 'none';
      }
    } else {
      throw new Error('No se pudo verificar la autenticación');
    }
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    document.getElementById('noAuth').style.display = 'block';
    document.getElementById('auth').style.display = 'none';
  }
});

// Función para cerrar sesión
async function logout() {
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión');
  }
}
window.logout = logout;

// Manejo de la suscripción del usuario (Formulario de Registro)
const form = document.querySelector('form');
const successMessage = document.getElementById('successMessage');
const errorRegistrado = document.getElementById('errorRegistrado');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar que se recargue la página

  const formData = new FormData(form);
  const userData = {
    name: formData.get('name'),
    age: formData.get('age'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // Verificar si las contraseñas coinciden
  if (userData.password !== formData.get('confirm-password')) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    // Enviar los datos del formulario al servidor
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      // Mostrar mensaje de éxito
      successMessage.style.display = 'block';
      form.reset(); // Limpiar el formulario
      errorRegistrado.style.display = 'none';
    } else {
      // Leer respuesta de error
      const error = await response.json();
      errorRegistrado.textContent = error.message || 'Error al registrarse, intente de nuevo';
      errorRegistrado.style.display = 'block';
      successMessage.style.display = 'none';  // Asegúrate de ocultar el mensaje de éxito
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    errorRegistrado.textContent = 'Error al registrar usuario. Intenta de nuevo.';
    errorRegistrado.style.display = 'block';
    successMessage.style.display = 'none';  // Asegúrate de ocultar el mensaje de éxito
  }
});
