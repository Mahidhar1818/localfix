const LF_API = (() => {
  const TOKEN_KEY = 'lf_token';

  function token() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setSession(data) {
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data.user;
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function hasToken() {
    return Boolean(token());
  }

  async function request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    if (token()) headers.Authorization = `Bearer ${token()}`;

    const response = await fetch(path, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status})`);
    }
    return data;
  }

  return {
    hasToken,
    clearSession,
    token,
    async login(email, password) {
      return setSession(await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }));
    },
    async register({ name, email, password, role, skills = [], phone }) {
      return setSession(await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, skills, phone })
      }));
    },
    async signIn(email, password, role) {
      try {
        return await this.login(email, password);
      } catch (error) {
        if (!/Invalid email or password/i.test(error.message)) throw error;
        try {
          const name = email.split('@')[0] || 'LocalFix user';
          return await this.register({
            name,
            email,
            password,
            role,
            skills: role === 'technician' ? ['AC Repair', 'Appliance Repair'] : []
          });
        } catch (registerError) {
          if (/already exists/i.test(registerError.message)) {
            throw new Error('Invalid email or password');
          }
          throw registerError;
        }
      }
    },
    async me() {
      return request('/api/auth/me');
    },
    async diagnose(problemDescription) {
      return request('/api/ai/diagnose', {
        method: 'POST',
        body: JSON.stringify({ problemDescription })
      });
    },
    async createJob(payload) {
      return request('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    async jobs() {
      return request('/api/jobs');
    },
    async technicians(category) {
      return request(`/api/technicians?category=${encodeURIComponent(category)}`);
    }
  };
})();
