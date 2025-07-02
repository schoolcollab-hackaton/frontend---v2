// API Configuration
const API_BASE_URL = 'http://localhost:8000';

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    score: number;
    avatar?: string;
    filiere?: string;
    niveau?: number;
    profile_completed?: boolean;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface RegisterData {
    nom: string;
    prenom: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ProfileCompleteData {
    filiere: string;
    niveau: number;
    competences: { [key: string]: string };
    centres_interet: string[];
}

class ApiService {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('access_token', token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('access_token');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        this.setToken(response.access_token);
        return response;
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        this.setToken(response.access_token);
        return response;
    }

    async getCurrentUser(): Promise<User> {
        return await this.request<User>('/auth/me');
    }

    async completeProfile(data: ProfileCompleteData): Promise<any> {
        return await this.request('/profile/complete', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    logout() {
        this.clearToken();
    }
}

export const apiService = new ApiService();