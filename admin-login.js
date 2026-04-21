(function () {
  const SESSION_KEY = "black_pinckl_admin_session_v1";
  document.body.classList.add("auth-checking");

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async function initLogin() {
    const form = document.getElementById("adminLoginForm");
    const error = document.getElementById("adminLoginError");
    const userInput = document.getElementById("adminUser");
    const passInput = document.getElementById("adminPass");
    if (!form || !error || !userInput || !passInput) return;

    if (window.BP_SUPABASE) {
      try {
        const session = await window.BP_SUPABASE.getCurrentSession();
        if (session) {
          window.location.href = "admin.html";
          return;
        }
        localStorage.removeItem(SESSION_KEY);
      } catch (_) {}
    }
    document.body.classList.remove("auth-checking");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";

      const email = userInput.value.trim().toLowerCase();
      const pass = passInput.value;
      if (!window.BP_SUPABASE) {
        error.textContent = "No se pudo iniciar Supabase en esta pagina.";
        return;
      }
      const { error: loginError } = await window.BP_SUPABASE.signInAdmin(email, pass);
      if (loginError) {
        error.textContent = "Credenciales invalidas o usuario sin acceso.";
        return;
      }

      const profile = await window.BP_SUPABASE.getMyProfile();
      if (!profile || !profile.role) {
        error.textContent = "Tu usuario existe, pero no tiene perfil habilitado.";
        await window.BP_SUPABASE.signOutAdmin();
        return;
      }

      const session = {
        username: email,
        name: profile.full_name || email,
        role: profile.role,
      };
      setSession(session);
      window.location.href = "admin.html";
    });
  }

  document.addEventListener("DOMContentLoaded", initLogin);
})();
