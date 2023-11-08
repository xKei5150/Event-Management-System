    import axios from 'axios';

const BASE_URL = 'http://localhost:8000/v1/';  // Adjust this based on your backend's base URL

export const addCategory = async (categoryName, mode, eventId) => {
    try {
        const response = await axios.post(`${BASE_URL}add-category/`, {
            name: categoryName,
            mode,
            event_id: eventId,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${BASE_URL}categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
        }
    };
export const fetchCategoriesAPI = async (event_id) => {
    try {
        const response = await axios.get(`${BASE_URL}categories/${event_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchCategory = async (category_id) => {
    try {
        const response = await axios.get(`${BASE_URL}category/${category_id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category ${category_id}:`, error);
        throw error;
    }
}

export const fetchCriteria = async (categoryId) => {
    try {
        const response =await axios.get(`${BASE_URL}criteria/${categoryId}`)
        return response.data
    } catch (error) {
        console.error('Error fetching criteria:', error);
        throw error;
    }
};


    export const fetchCategoryDetails = async (categoryId) => {
        try {
            // Construct URL based on whether categoryId is provided or not
            const endpoint = categoryId
                ? `${BASE_URL}category-details/${categoryId}`
                : `${BASE_URL}category-details`;

            const response = await axios.get(endpoint);

            return response.data;

        } catch (error) {
            console.error('Error fetching category details:', error);
            throw error;
        }
    };

    export const updateCategory = async (categoryId, customCriteria, referencedCriteria) => {
        // Assuming you're using fetch API, axios, or a similar method
        try {
            const response = await axios.put(`${BASE_URL}categories/${categoryId}/edit/`, {
                custom_criteria: customCriteria,
                referenced_criteria: referencedCriteria
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response.data || 'Network error occurred');
        }
    };
