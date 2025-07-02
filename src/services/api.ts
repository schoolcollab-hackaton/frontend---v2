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
    profile_completed: boolean; // Now this will be returned from backend
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
        console.log('Making API request to:', url);

        const config: RequestInit = {
            credentials: 'include', // Include httpOnly cookies
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            console.log('Response received:', response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('Error response data:', errorData);
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('Success response data:', data);
            return data;
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
        // Since backend expects Authorization header but we're using httpOnly cookies,
        // we need to make the request without auth header and let cookies handle it
        return await this.request<User>('/auth/me');
    }

    async completeProfile(data: ProfileCompleteData): Promise<any> {
        return await this.request('/profile/complete', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    logout() {
        // For httpOnly cookies, you'd need a backend logout endpoint
        // that clears the cookie
    }
}

export const apiService = new ApiService();