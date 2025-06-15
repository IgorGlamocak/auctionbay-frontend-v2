import React, { FC } from 'react'
import Layout from '../../components/ui/Layout'
import Navbar from '../../components/ui/Navbar'

const Home: FC = () => {
    return (
        <>
            <Navbar/>
            <Layout>

                <div className="p-2 mb-4 text-center">
                    <div className="container-fluid py-4 ">
                        <h1 className="display-5 fw-bold text-center">E-auctions made easy!</h1>
                        <p className="text-center fs-6">
                            Simple way for selling your unused products, or <br/> getting a deal on product you want!
                        </p>
                        <button type="button" className="btn startBidding-button" style={{ marginBottom: '100px' }}>Start bidding</button>

                        <img
                            src="/images/home_page.png"
                            alt="Auction Image"
                            style={{
                                borderColor: '#272D2D',
                                width: '1144px',
                                borderRadius: '32px',
                                border: '8px solid',
                            }}
                        />

                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Home