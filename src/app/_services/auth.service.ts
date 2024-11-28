import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

export interface IUser {
  userName:string
  email: string;
  name?: string;
  avatarUrl?: string;
}
export interface IUserLoginRequest {
  userName:string
  passWord: string;
}

export interface SearchRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
  query?: string;
}
export interface ProjectSearchRequest extends SearchRequest {
  projectName?: string;
}
export interface TaskSearchRequest extends SearchRequest {
  taskName?: string;
  projectId: number;
}

export interface IUserCreate {
  userName: string,
  userPassword: string,
  email: string,
  roleName: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private axiosClient: AxiosInstance;

  constructor() {
    
    this.axiosClient = axios.create({
      baseURL: 'http://localhost:8080/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token'); // Or wherever you store your token
        
        if (token) {
          // Attach the token to the Authorization header
          config.headers['Authorization'] = `Bearer ${token}`;
        }
  
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }


  

  public async createUser(user: IUserCreate): Promise<any> {
    try {
      const response = await this.axiosClient.post('/auth/register', user);
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error.response?.data || error.message;
    }
  }

  public async authenticate(payload: IUserLoginRequest): Promise<any> {
    try {
      const response = await this.axiosClient.post('/auth/authenticate', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error login user:', error);
      throw error.response?.data || error.message;
    }
  }

  public async registerProject(payload: any): Promise<any> {
    try {
      const response = await this.axiosClient.post('/project/register', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error login user:', error);
      throw error.response?.data || error.message;
    }
  }

  public async searchProjects(payload: any): Promise<any> {
    try {
          // Prepare query params
    const queryParams = new URLSearchParams(payload).toString();

      const response = await this.axiosClient.get(`/project/search?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Error login user:', error);
      throw error.response?.data || error.message;
    }
  }

  public async getProjectDetail(payload: any): Promise<any> {
    try {
          // Prepare query params
      const response = await this.axiosClient.get(`/project/detail/${payload}`);
      return response.data;
    } catch (error: any) {
      console.error('Error login user:', error);
      throw error.response?.data || error.message;
    }
  }

  public async registerTasks(payload: any): Promise<any> {
    try {
      const response = await this.axiosClient.post('/task/register', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error login user:', error);
      throw error.response?.data || error.message;
    }
  }

  public async searchTasks(payload: any): Promise<any> {
    try {
          // Prepare query params
    const queryParams = new URLSearchParams(payload).toString();

      const response = await this.axiosClient.get(`/task/search?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Error searchTasks :', error);
      throw error.response?.data || error.message;
    }
  }

  public async updateTasks(taskId:any,payload: any): Promise<any> {
    try {
          // Prepare query params
      const response = await this.axiosClient.put(`/task/update/${taskId}`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Error searchTasks :', error);
      throw error.response?.data || error.message;
    }
  }


  public async deleteTasks(payload: any): Promise<any> {
    try {
          // Prepare query params
      const response = await this.axiosClient.delete(`/task/remove/${payload}`);
      return response.data;
    } catch (error: any) {
      console.error('Error searchTasks :', error);
      throw error.response?.data || error.message;
    }
  }

  public async getUserTask(): Promise<any> {
    try {
          // Prepare query params
      const response = await this.axiosClient.get(`/task/users`);
      return response.data;
    } catch (error: any) {
      console.error('Error login user:', error);
      throw error.response?.data || error.message;
    }
  }
}
