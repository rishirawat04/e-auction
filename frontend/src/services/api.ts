import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api/v1';
// socket url 

export const API_BASE_URL_SOCKET_IO ='http://localhost:5000'

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout:10000,
    withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]; 
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async(email:string, password: string) => {

    try {
        const res = await api.post('auth/signin', {email, password});
        return res.data;
    } catch (error) {
         throw error.response?.data || error.message;
    }

};

export const register = async (fullName: string, email: string, password: string, role: 'bidder' | 'auctioneer') => {
  try {
    const response = await api.post('/auth/signup', { fullName, email, password, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAuctions = async ({ search, status, bidType, sortBy }) => {
  try {
    const response = await api.get('/auction', {
      params: {
        search,
        status,
        bidType,
        sortBy,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAuctionsByAuctioneer = async () => {
  try {
    const response = await api.get('/auction/my-auctions');
  return response.data; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAuctionById = async (id:string) => {
  try {
    const response = await api.get(`/auction/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBidsByAuction = async (auctionId:string) => {
  try {
    const response = await api.get(`/bid/${auctionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const placeBid = async (auctionId:string, amount:number) => {
  try {
    const response = await api.post(`/bid`, { auctionId, amount });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new auction
export const createAuction = async (auctionData: any) => {
  try {
    const response = await api.post("/auction", auctionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update an auction
export const updateAuction = async (id: string, auctionData: any) => {
  try {
    const response = await api.put(`/auction/${id}`, auctionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete an auction
export const deleteAuction = async (id: string) => {
  try {
    const response = await api.delete(`/auction/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// End an auction
export const endAuction = async (id: string) => {
  try {
    const response = await api.post(`/auction/${id}/end`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//Logout user 
export const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/";
};



