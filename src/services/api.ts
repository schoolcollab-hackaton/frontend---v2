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
    profile_completed: boolean;
    discord?: string;
    linkedin?: string;
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
    is_mentor?: boolean;
    discord?: string;
    linkedin?: string;
}

export interface SkillDetail {
    skill: string;
    their_level?: number;
    your_level?: number;
    benefit: string;
}

export interface SwapDetails {
    skills_they_offer: SkillDetail[];
    skills_you_offer: SkillDetail[];
    mutual_benefits: string[];
    skill_gaps_filled: number;
    complementary_skills: number;
}

export interface SkillSwapRecommendation {
    id: number;
    nom: string;
    prenom: string;
    score: number;
    filiere?: string;
    niveau?: string;
    roles: string[];
    interests: string[];
    competences: Array<{ [key: string]: any }>;

    swap_score: number;
    swap_details: SwapDetails;
    recommendation_type: string;
}

export interface SwapRequest {
    id: number;
    type: string;
    sender_id: number;
    receiver_id: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface CreateSwapRequest {
    type: 'skill-swap';
    receiver_id: number;
    message: string;
}

export interface DemandeSoutien {
    id: number;
    demandeur_id: number;
    helper_id?: number;
    competence_id: number;
    competence_name?: string;
    statut: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
    dateDemande: string;
}

export interface DemandeSoutienCreate {
    competence_id: number;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('Making API request to:', url);

        const config: RequestInit = {
            credentials: 'include', // This is crucial for httpOnly cookies
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

                // Handle authentication errors
                if (response.status === 401) {
                    // Clear any stored user data but DON'T redirect here
                    localStorage.removeItem('user');
                    // Let the calling component handle the redirect
                    return Promise.reject(new Error('Session expired'));
                }

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
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Store user data locally (token is in httpOnly cookie)
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Store user data locally (token is in httpOnly cookie)
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    }

    async getCurrentUser(): Promise<User> {
        return await this.request<User>('/auth/me');
    }

    async completeProfile(data: ProfileCompleteData): Promise<any> {
        const response = await this.request('/profile/complete', {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        // Update stored user data to reflect profile completion
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            user.profile_completed = true;
            user.filiere = data.filiere;
            user.niveau = data.niveau;
            if (data.discord) user.discord = data.discord;
            if (data.linkedin) user.linkedin = data.linkedin;
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response;
    }

    async logout(): Promise<void> {
        try {
            await this.request('/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Clear local storage (httpOnly cookie will be cleared by server)
            localStorage.removeItem('user');
        }
    }

    // Check if user is authenticated by trying to get current user
    async isAuthenticated(): Promise<boolean> {
        try {
            await this.getCurrentUser();
            return true;
        } catch {
            return false;
        }
    }

    // Get stored user data (for quick access without API call)
    getStoredUser(): User | null {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    }

    // Profile data endpoints
    async getCompetences(): Promise<Array<{ nom: string, description: string }>> {
        return await this.request<Array<{ nom: string, description: string }>>('/profile/competences');
    }

    async getCentresInteret(): Promise<Array<{ titre: string }>> {
        return await this.request<Array<{ titre: string }>>('/profile/centres-interet');
    }

    // Skill Swap Recommendations
    async getSkillSwapRecommendations(limit: number = 10): Promise<SkillSwapRecommendation[]> {
        return await this.request<SkillSwapRecommendation[]>(
            `/recommendations/skill-swap?limit=${limit}`
        );
    }

    // Send swap request (updated to match backend)
    async sendSwapRequest(data: {
        receiver_id: number;
        message: string;
    }): Promise<SwapRequest> {
        const requestData: CreateSwapRequest = {
            type: 'skill-swap',
            receiver_id: data.receiver_id,
            message: data.message,
        };

        return await this.request<SwapRequest>('/requests', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });
    }

    // Get received swap requests (updated to match backend)
    async getReceivedSwapRequests(): Promise<SwapRequest[]> {
        return await this.request<SwapRequest[]>('/requests/received');
    }

    // Get sent swap requests (updated to match backend)
    async getSentSwapRequests(): Promise<SwapRequest[]> {
        return await this.request<SwapRequest[]>('/requests/sent');
    }

    // Accept swap request (updated to match backend)
    async acceptSwapRequest(requestId: number): Promise<{ message: string }> {
        return await this.request<{ message: string }>(`/requests/${requestId}/accept`, {
            method: 'PUT',
        });
    }

    // Reject swap request (updated to match backend)
    async rejectSwapRequest(requestId: number): Promise<{ message: string }> {
        return await this.request<{ message: string }>(`/requests/${requestId}/reject`, {
            method: 'PUT',
        });
    }

    // Demande Soutien (Support Requests) methods
    async createDemandeSoutien(data: DemandeSoutienCreate): Promise<DemandeSoutien> {
        return await this.request<DemandeSoutien>('/demande-soutien', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMyDemandes(): Promise<DemandeSoutien[]> {
        return await this.request<DemandeSoutien[]>('/demande-soutien/mes-demandes');
    }

    async getDemandesEnAttente(): Promise<DemandeSoutien[]> {
        return await this.request<DemandeSoutien[]>('/demande-soutien/en-attente');
    }

    async accepterDemande(demandeId: number): Promise<DemandeSoutien> {
        return await this.request<DemandeSoutien>(`/demande-soutien/${demandeId}/accepter`, {
            method: 'POST',
        });
    }

    async updateDemande(demandeId: number, data: { helper_id?: number; statut?: string }): Promise<DemandeSoutien> {
        return await this.request<DemandeSoutien>(`/demande-soutien/${demandeId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteDemande(demandeId: number): Promise<void> {
        return await this.request<void>(`/demande-soutien/${demandeId}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();