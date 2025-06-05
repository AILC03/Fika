export const authUser = async (email, password) => {
    const response = await fetch('https://api-legisconnect-production.up.railway.app/users/auth', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de autenticación');
    }
  
    return await response.json();
  };