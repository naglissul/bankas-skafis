import axios from 'axios';
import { get } from 'svelte/store';
import {
	CategoryControllerApi,
	ProblemControllerApi,
	TestControllerApi,
	UserControllerApi
} from './gen-client/api'; // Adjust the import path
import { currentUser } from '$lib/stores';
import { BASE_PATH } from './gen-client/base';

const axiosInstance = axios.create({
	baseURL: BASE_PATH
});

// Add a request interceptor to set the Authorization header dynamically
axiosInstance.interceptors.request.use(
	async (config) => {
		// Wait for the token to be available
		const token = await new Promise((resolve) => {
			const unsubscribe = currentUser.subscribe((user) => {
				if (user && user.idToken) {
					resolve(user.idToken);
					unsubscribe();
				}
			});
		});
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		// Dynamically set the Content-Type header
		if (config.data instanceof FormData) {
			config.headers['Content-Type'] = 'multipart/form-data';
		} else {
			config.headers['Content-Type'] = 'application/json';
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const categoryApi = new CategoryControllerApi(undefined, BASE_PATH, axiosInstance);
const problemApi = new ProblemControllerApi(undefined, BASE_PATH, axiosInstance);
const userApi = new UserControllerApi(undefined, BASE_PATH, axiosInstance);
const testApi = new TestControllerApi(undefined, BASE_PATH, axiosInstance);

export { categoryApi, problemApi, userApi, testApi };
