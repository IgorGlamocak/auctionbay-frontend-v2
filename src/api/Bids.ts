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

export const fetchBids = async (id: number) => {
    const url = `${apiRoutes.FETCH_BIDS}${id}`
    const response = await axios.get(url, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}
export const placeBid = async (auctionId: number, amount: number) => {
    const url = apiRoutes.PLACE_BID.replace('{id}', auctionId.toString())
    const jwtToken = getJwtTokenFromCookie()
    try {
        const response = await axios.post(url, {
            auctionId: auctionId,
            amount: amount,
        }, {
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        })
        return response.data
    } catch (error) {
        console.error('Error placing bid:', error)
        throw new Error('Failed to place bid. Please try again.')
    }
}