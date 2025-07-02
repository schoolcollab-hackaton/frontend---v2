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
    roles?: string[];
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
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            credentials: 'include', // This handles the httpOnly cookie automatically
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            console.log('Making request to:', url, 'with config:', config);
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Request failed:', response.status, errorData);
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
        return await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: LoginData): Promise<AuthResponse> {
        return await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getCurrentUser(): Promise<User> {
        return await this.request<User>('/auth/me');
    }

    async completeProfile(data: ProfileCompleteData): Promise<any> {
        console.log('Attempting to complete profile with data:', data);
        return await this.request('/profile/complete', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async logout(): Promise<void> {
        return await this.request('/auth/logout', {
            method: 'POST',
        });
    }
}

export const apiService = new ApiService();