import axios from 'axios'
import Cookies from 'js-cookie'
import { apiRoutes } from '../constants/apiConstants'

const getJwtTokenFromCookie = () => {
    const jwtToken = Cookies.get('token')
    if (!jwtToken) {
        throw new Error('JWT token not found or expired')
    }
    return jwtToken
}

export const placeAuction = async (formData: FormData) => {
    const url = apiRoutes.PLACE_AUCTION
    const jwtToken = getJwtTokenFromCookie()
    try {
        const response = await axios.post(url, formData, {
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error placing auction:', error)
        throw new Error('Failed to place auction. Please try again.')
    }
}

export const deleteAuction = async (auctionId: string) => {
    const jwtToken = getJwtTokenFromCookie()
    try {
        const response = await axios.delete(`${apiRoutes.DELETE_AUCTION}${auctionId}`, {
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        })
        return response.data
    } catch (error) {
        console.error('Error deleting auction:', error)
        throw new Error('Failed to delete auction. Please try again.')
    }
}

export const updateAuction = async (auctionId: string, formData: FormData) => {
    const jwtToken = getJwtTokenFromCookie()
    const url = `${process.env.REACT_APP_API_URL}${apiRoutes.UPDATE_AUCTION}${auctionId}`

    try {
        const response = await axios.patch(url, formData, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error updating auction:', error)
        throw new Error('Failed to update auction. Please try again.')
    }
}

export const fetchAllAuctions = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_ALLAUCTIONS, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const fetchMyAuctions = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_MYAUCTIONS, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const fetchBidding = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_BIDDING, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const fetchWon = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_WON, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const fetchAuctionDetails = async (id: number) => {
    const url = `${apiRoutes.FETCH_AUCTIONDETAIL}${id}`
    const response = await axios.get(url, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}