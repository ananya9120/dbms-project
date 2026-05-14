const apiCall = async (url, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');
    
    // Prevent browser caching for GET requests
    if (method === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        url += separator + '_t=' + Date.now();
    }

    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || 'Something went wrong' };
        }
        return data;
    } catch (err) {
        return { error: err.message };
    }
};

const showAlert = (msg, type = 'error') => {
    const alertEl = document.getElementById('alertMsg');
    if(!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = `alert-message alert-${type}`;
    alertEl.style.display = 'block';
    setTimeout(() => { alertEl.style.display = 'none'; }, 5000);
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
};
