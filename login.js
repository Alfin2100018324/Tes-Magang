document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('🟢 Form submitted');

    const username = event.target.username.value;
    const password = event.target.password.value;

    console.log('👤 Username:', username);
    console.log('🔑 Password:', password);

    try {
        const response = await fetch('http://127.0.0.1:3001/', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            console.error(`🔴 Login failed. Status: ${response.status}`);
            const errorData = await response.json();
            console.error('❌ Error:', errorData);
            alert("Login gagal! Cek username/password.");
            return;
        }

        const data = await response.json();
        const token = data.token;
        console.log('✅ Token:', token);

        if (!token) {
            console.error("❌ Token tidak diterima dari server!");
            alert("Token tidak ditemukan, coba lagi.");
            return;
        }

        localStorage.setItem('token', token);
        console.log("✅ Token berhasil disimpan!");

        window.location.href = '../CRUD.html'; 

    } catch (error) {
        console.error('❌ Error saat login:', error);
        alert("Terjadi kesalahan saat menghubungi server.");
    }
});
